import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initModal } from '../src/scripts/modal';

function renderModal() {
  document.body.innerHTML = `
    <button id="origin">Enviar</button>
    <div id="confirmation" data-modal-overlay hidden>
      <div
        id="confirmation-dialog"
        data-modal-dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
        aria-describedby="confirmation-description"
        tabindex="-1"
      >
        <h2 id="confirmation-title">Listo</h2>
        <p id="confirmation-description">Recibimos tus datos.</p>
        <a href="mailto:test@example.com">Correo</a>
        <button type="button" data-modal-close>Cerrar</button>
      </div>
    </div>
  `;

  const overlay = document.querySelector('[data-modal-overlay]') as HTMLElement;
  const dialog = document.querySelector('[data-modal-dialog]') as HTMLElement;
  const origin = document.querySelector('#origin') as HTMLButtonElement;
  const link = dialog.querySelector('a') as HTMLAnchorElement;
  const closeButton = dialog.querySelector('[data-modal-close]') as HTMLButtonElement;

  return {
    overlay,
    dialog,
    origin,
    link,
    closeButton,
    controller: initModal(overlay),
  };
}

describe('initModal', () => {
  beforeEach(() => {
    document.body.removeAttribute('data-modal-open');
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
    document.body.removeAttribute('data-modal-open');
    document.body.style.overflow = '';
  });

  it('opens with accessible references and moves focus into the dialog', () => {
    const { overlay, dialog, origin, controller } = renderModal();

    expect(document.getElementById(dialog.getAttribute('aria-labelledby')!)).not.toBeNull();
    expect(document.getElementById(dialog.getAttribute('aria-describedby')!)).not.toBeNull();

    origin.focus();
    controller.open(origin);

    expect(overlay.hidden).toBe(false);
    expect(document.activeElement).toBe(dialog);
    expect(document.body.dataset.modalOpen).toBe('true');
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('uses the active element as the return target when no origin is supplied', () => {
    const { origin, closeButton, controller } = renderModal();

    origin.focus();
    controller.open();
    closeButton.click();

    expect(document.activeElement).toBe(origin);
  });

  it('wraps Tab and Shift+Tab inside the dialog', () => {
    const { dialog, link, closeButton, controller } = renderModal();
    controller.open();

    closeButton.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(document.activeElement).toBe(link);

    link.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
    }));
    expect(document.activeElement).toBe(closeButton);

    document.body.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(document.activeElement).toBe(link);

    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('keeps focus on the dialog when no descendants are focusable', () => {
    const { dialog, link, closeButton, controller } = renderModal();
    link.removeAttribute('href');
    closeButton.disabled = true;
    controller.open();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));

    expect(document.activeElement).toBe(dialog);
  });

  it('closes with the visible button and restores focus', () => {
    const { overlay, origin, closeButton, controller } = renderModal();
    origin.focus();
    controller.open(origin);

    closeButton.click();

    expect(overlay.hidden).toBe(true);
    expect(document.activeElement).toBe(origin);
  });

  it('closes with Escape', () => {
    const { overlay, controller } = renderModal();
    controller.open();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(overlay.hidden).toBe(true);
  });

  it('closes only when the overlay itself is clicked', () => {
    const { overlay, dialog, controller } = renderModal();
    controller.open();

    dialog.click();
    expect(overlay.hidden).toBe(false);

    overlay.click();
    expect(overlay.hidden).toBe(true);
  });

  it('restores prior scroll state and tolerates a removed origin', () => {
    const { overlay, origin, controller } = renderModal();
    document.body.style.overflow = 'clip';
    document.body.setAttribute('data-modal-open', 'existing');
    controller.open(origin);
    origin.remove();

    expect(() => controller.close()).not.toThrow();
    expect(overlay.hidden).toBe(true);
    expect(document.body.style.overflow).toBe('clip');
    expect(document.body.getAttribute('data-modal-open')).toBe('existing');
  });

  it('is idempotent when initialized, opened, or closed repeatedly', () => {
    const { overlay, controller } = renderModal();
    const sameController = initModal(overlay);

    expect(sameController).toBe(controller);
    expect(() => {
      controller.open();
      controller.open();
      controller.close();
      controller.close();
      controller.destroy();
    }).not.toThrow();
  });

  it('can be opened through a local custom event', () => {
    const { overlay, dialog, origin } = renderModal();

    overlay.dispatchEvent(new CustomEvent('modal:open', {
      detail: { origin },
    }));

    expect(overlay.hidden).toBe(false);
    expect(document.activeElement).toBe(dialog);
  });
});
