import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  initWeb3Forms,
  submitWeb3Form,
  Web3FormsSubmissionError,
} from '../src/scripts/web3forms';

function renderForm(accessKey = 'test-access-key-123') {
  document.body.innerHTML = `
    <form action="https://api.web3forms.com/submit" method="POST">
      <input name="access_key" value="${accessKey}">
      <input name="nombre">
      <button type="submit">Enviar</button>
      <p role="status"></p>
    </form>
  `;

  const name = document.querySelector('[name="nombre"]') as HTMLInputElement;
  name.value = 'Ada Lovelace';

  return {
    form: document.querySelector('form') as HTMLFormElement,
    status: document.querySelector('[role="status"]') as HTMLElement,
    button: document.querySelector('button') as HTMLButtonElement,
    name,
  };
}

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('submitWeb3Form', () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it('requires HTTP success and success: true', async () => {
    const { form } = renderForm();
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({ success: true }));

    await submitWeb3Form(form, { fetchImpl });

    expect(fetchImpl).toHaveBeenCalledOnce();
    expect(fetchImpl).toHaveBeenCalledWith(
      form.action,
      expect.objectContaining({
        method: 'post',
        body: expect.any(FormData),
        headers: { Accept: 'application/json' },
      }),
    );
  });

  it.each([
    ['functional rejection', jsonResponse({ success: false }), 'rejected'],
    ['unknown schema', jsonResponse({ message: 'ok' }), 'invalid-response'],
    ['rate limiting', jsonResponse({ success: false }, 429), 'rate-limit'],
    ['client rejection', jsonResponse({ success: false }, 422), 'rejected'],
    ['provider outage', jsonResponse({ success: false }, 503), 'server'],
  ])('classifies %s', async (_label, response, kind) => {
    const { form } = renderForm();

    await expect(
      submitWeb3Form(form, { fetchImpl: vi.fn().mockResolvedValue(response) }),
    ).rejects.toMatchObject({ kind });
  });

  it('rejects malformed JSON', async () => {
    const { form } = renderForm();
    const response = new Response('<html>not json</html>', { status: 200 });

    await expect(
      submitWeb3Form(form, { fetchImpl: vi.fn().mockResolvedValue(response) }),
    ).rejects.toMatchObject({ kind: 'invalid-response' });
  });

  it('rejects invalid configuration without making a request', async () => {
    const { form } = renderForm('TU_ACCESS_KEY_WEB3FORMS');
    const fetchImpl = vi.fn();

    await expect(submitWeb3Form(form, { fetchImpl })).rejects.toMatchObject({
      kind: 'configuration',
    });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('classifies network failures', async () => {
    const { form } = renderForm();

    await expect(
      submitWeb3Form(form, { fetchImpl: vi.fn().mockRejectedValue(new TypeError('offline')) }),
    ).rejects.toMatchObject({ kind: 'network' });
  });

  it('aborts after the configured timeout', async () => {
    vi.useFakeTimers();
    const { form } = renderForm();
    const fetchImpl = vi.fn((_input, init) => new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    }));
    const request = submitWeb3Form(form, { fetchImpl, timeoutMs: 50 });
    const expectation = expect(request).rejects.toMatchObject({ kind: 'timeout' });

    await vi.advanceTimersByTimeAsync(50);

    await expectation;
  });

  it('classifies a stalled response body as a timeout', async () => {
    vi.useFakeTimers();
    const { form } = renderForm();
    const fetchImpl = vi.fn((_input, init) => Promise.resolve({
      ok: true,
      status: 200,
      json: () => new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
      }),
    } as Response));
    const request = submitWeb3Form(form, { fetchImpl, timeoutMs: 50 });
    const expectation = expect(request).rejects.toMatchObject({ kind: 'timeout' });

    await vi.advanceTimersByTimeAsync(50);

    await expectation;
  });
});

describe('initWeb3Forms', () => {
  it('blocks duplicate submissions and resets only after confirmed success', async () => {
    const { form, status, button, name } = renderForm();
    let resolveResponse: (response: Response) => void = () => {};
    const fetchImpl = vi.fn(() => new Promise<Response>((resolve) => {
      resolveResponse = resolve;
    }));
    const onSuccess = vi.fn();

    initWeb3Forms({ form, statusElement: status, fetchImpl, onSuccess });
    form.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    form.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));

    expect(fetchImpl).toHaveBeenCalledOnce();
    expect(button.disabled).toBe(true);
    expect(form.dataset.submissionState).toBe('submitting');
    expect(name.value).toBe('Ada Lovelace');

    resolveResponse(jsonResponse({ success: true }));
    await vi.waitFor(() => expect(form.dataset.submissionState).toBe('success'));

    expect(name.value).toBe('');
    expect(button.disabled).toBe(false);
    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it('preserves data and allows retry after an error', async () => {
    const { form, status, button, name } = renderForm();
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({ success: false }));

    initWeb3Forms({ form, statusElement: status, fetchImpl });
    form.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    await vi.waitFor(() => expect(form.dataset.submissionState).toBe('error'));

    expect(name.value).toBe('Ada Lovelace');
    expect(button.disabled).toBe(false);
    expect(status.textContent).toContain('rechazó');

    form.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    await vi.waitFor(() => expect(fetchImpl).toHaveBeenCalledTimes(2));
  });

  it('surfaces a configuration error without clearing data', async () => {
    const { form, status, name } = renderForm('');
    const fetchImpl = vi.fn();

    initWeb3Forms({ form, statusElement: status, fetchImpl });
    form.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    await vi.waitFor(() => expect(form.dataset.submissionState).toBe('error'));

    expect(fetchImpl).not.toHaveBeenCalled();
    expect(name.value).toBe('Ada Lovelace');
    expect(status.textContent).toContain('configurado');
  });
});

describe('Web3FormsSubmissionError', () => {
  it('keeps a machine-readable error kind', () => {
    const error = new Web3FormsSubmissionError('server', 'Unavailable', 503);
    expect(error).toMatchObject({ kind: 'server', status: 503 });
  });
});
