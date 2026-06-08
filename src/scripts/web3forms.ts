import { isValidWeb3FormsAccessKey } from '../lib/web3forms-config.mjs';

export type Web3FormsState = 'idle' | 'submitting' | 'success' | 'error';

export type Web3FormsErrorKind =
  | 'configuration'
  | 'network'
  | 'timeout'
  | 'rate-limit'
  | 'rejected'
  | 'server'
  | 'invalid-response';

export class Web3FormsSubmissionError extends Error {
  kind: Web3FormsErrorKind;
  status?: number;

  constructor(kind: Web3FormsErrorKind, message: string, status?: number) {
    super(message);
    this.name = 'Web3FormsSubmissionError';
    this.kind = kind;
    this.status = status;
  }
}

type SubmitOptions = {
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
};

type InitOptions = SubmitOptions & {
  form: HTMLFormElement;
  statusElement: HTMLElement;
  submittingLabel?: string;
  onSuccess?: (submitter: HTMLElement | null) => void;
};

const DEFAULT_TIMEOUT_MS = 10_000;

const ERROR_MESSAGES: Record<Web3FormsErrorKind, string> = {
  configuration: 'El formulario no está configurado correctamente. Intenta más tarde o escríbenos por correo.',
  network: 'No pudimos conectar con el servicio. Revisa tu conexión e intenta nuevamente.',
  timeout: 'No pudimos confirmar el envío a tiempo. Espera un momento antes de volver a intentarlo.',
  'rate-limit': 'Se alcanzó el límite temporal de envíos. Espera unos minutos e intenta nuevamente.',
  rejected: 'El servicio rechazó el envío. Revisa tus datos e intenta nuevamente.',
  server: 'El servicio de formularios no está disponible temporalmente. Intenta más tarde.',
  'invalid-response': 'No pudimos confirmar que el formulario se enviara. Tus datos siguen aquí para reintentar.',
};

function getAccessKey(form: HTMLFormElement): string {
  const input = form.elements.namedItem('access_key');
  return input instanceof HTMLInputElement ? input.value : '';
}

function errorForStatus(status: number): Web3FormsSubmissionError {
  if (status === 429) {
    return new Web3FormsSubmissionError('rate-limit', ERROR_MESSAGES['rate-limit'], status);
  }

  if (status >= 500) {
    return new Web3FormsSubmissionError('server', ERROR_MESSAGES.server, status);
  }

  return new Web3FormsSubmissionError('rejected', ERROR_MESSAGES.rejected, status);
}

export async function submitWeb3Form(
  form: HTMLFormElement,
  { fetchImpl = fetch, timeoutMs = DEFAULT_TIMEOUT_MS }: SubmitOptions = {},
): Promise<void> {
  if (!isValidWeb3FormsAccessKey(getAccessKey(form))) {
    throw new Web3FormsSubmissionError('configuration', ERROR_MESSAGES.configuration);
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    let response: Response;

    try {
      response = await fetchImpl(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
    } catch (error) {
      if (controller.signal.aborted) {
        throw new Web3FormsSubmissionError('timeout', ERROR_MESSAGES.timeout);
      }

      throw new Web3FormsSubmissionError('network', ERROR_MESSAGES.network);
    }

    if (!response.ok) {
      throw errorForStatus(response.status);
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      if (controller.signal.aborted) {
        throw new Web3FormsSubmissionError('timeout', ERROR_MESSAGES.timeout);
      }

      throw new Web3FormsSubmissionError('invalid-response', ERROR_MESSAGES['invalid-response']);
    }

    if (
      typeof payload !== 'object' ||
      payload === null ||
      !('success' in payload) ||
      typeof payload.success !== 'boolean'
    ) {
      throw new Web3FormsSubmissionError('invalid-response', ERROR_MESSAGES['invalid-response']);
    }

    if (payload.success !== true) {
      throw new Web3FormsSubmissionError('rejected', ERROR_MESSAGES.rejected, response.status);
    }
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export function initWeb3Forms({
  form,
  statusElement,
  submittingLabel = 'Enviando…',
  onSuccess,
  fetchImpl,
  timeoutMs,
}: InitOptions): () => void {
  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!submitButton) {
    throw new Error('El formulario Web3Forms necesita un botón submit.');
  }

  const idleLabel = submitButton.textContent?.trim() || 'Enviar';
  let state: Web3FormsState = 'idle';

  const setState = (nextState: Web3FormsState, message = '') => {
    state = nextState;
    form.dataset.submissionState = nextState;
    form.setAttribute('aria-busy', String(nextState === 'submitting'));
    submitButton.disabled = nextState === 'submitting';
    submitButton.setAttribute('aria-disabled', String(nextState === 'submitting'));
    submitButton.textContent = nextState === 'submitting' ? submittingLabel : idleLabel;
    statusElement.dataset.state = nextState;
    statusElement.textContent = message;
  };

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    if (state === 'submitting') return;

    const submitter = event.submitter instanceof HTMLElement ? event.submitter : submitButton;
    setState('submitting', submittingLabel);

    try {
      await submitWeb3Form(form, { fetchImpl, timeoutMs });
      form.reset();
      setState('success', 'Formulario enviado correctamente.');
      onSuccess?.(submitter);
    } catch (error) {
      const message =
        error instanceof Web3FormsSubmissionError
          ? error.message
          : ERROR_MESSAGES['invalid-response'];
      setState('error', message);
    }
  };

  setState('idle');
  form.addEventListener('submit', handleSubmit);

  return () => form.removeEventListener('submit', handleSubmit);
}
