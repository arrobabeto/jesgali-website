export type ModalController = {
  open: (origin?: HTMLElement | null) => void;
  close: () => void;
  destroy: () => void;
};

const initializedModals = new WeakMap<HTMLElement, ModalController>();

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function isUsableFocusTarget(element: Element | null): element is HTMLElement {
  return (
    element instanceof HTMLElement &&
    element.isConnected &&
    !element.hasAttribute('disabled') &&
    element.getAttribute('aria-hidden') !== 'true' &&
    !element.closest('[hidden]')
  );
}

function getFocusableElements(dialog: HTMLElement): HTMLElement[] {
  return Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR))
    .filter(isUsableFocusTarget);
}

export function initModal(overlay: HTMLElement): ModalController {
  const existingController = initializedModals.get(overlay);
  if (existingController) return existingController;

  const dialog = overlay.querySelector<HTMLElement>('[data-modal-dialog]');
  const closeButton = overlay.querySelector<HTMLElement>('[data-modal-close]');

  if (!dialog || !closeButton) {
    throw new Error('El modal necesita [data-modal-dialog] y [data-modal-close].');
  }

  let isOpen = false;
  let returnFocus: HTMLElement | null = null;
  let previousOverflow = '';
  let previousModalOpenAttribute: string | null = null;

  const handleKeydown = (event: KeyboardEvent) => {
    if (!isOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = getFocusableElements(dialog);
    if (focusable.length === 0) {
      event.preventDefault();
      dialog.focus({ preventScroll: true });
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && (activeElement === first || !dialog.contains(activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (activeElement === last || !dialog.contains(activeElement))) {
      event.preventDefault();
      first.focus();
    }
  };

  const handleOverlayClick = (event: MouseEvent) => {
    if (event.target === overlay) close();
  };

  const handleOpenEvent = (event: Event) => {
    const { detail } = event as CustomEvent<{ origin?: HTMLElement | null }>;
    open(detail?.origin ?? null);
  };

  const open = (origin?: HTMLElement | null) => {
    if (isOpen) return;

    const activeElement = document.activeElement;
    const requestedOrigin: Element | null = origin ?? null;
    returnFocus = isUsableFocusTarget(requestedOrigin)
      ? requestedOrigin
      : isUsableFocusTarget(activeElement)
        ? activeElement
        : null;

    previousOverflow = document.body.style.overflow;
    previousModalOpenAttribute = document.body.getAttribute('data-modal-open');
    document.body.setAttribute('data-modal-open', 'true');
    document.body.style.overflow = 'hidden';

    isOpen = true;
    overlay.hidden = false;
    dialog.focus({ preventScroll: true });
  };

  const close = () => {
    if (!isOpen) return;

    isOpen = false;
    overlay.hidden = true;
    document.body.style.overflow = previousOverflow;

    if (previousModalOpenAttribute === null) {
      document.body.removeAttribute('data-modal-open');
    } else {
      document.body.setAttribute('data-modal-open', previousModalOpenAttribute);
    }

    const focusTarget = returnFocus;
    returnFocus = null;
    if (isUsableFocusTarget(focusTarget)) {
      focusTarget.focus({ preventScroll: true });
    }
  };

  const destroy = () => {
    close();
    closeButton.removeEventListener('click', close);
    overlay.removeEventListener('click', handleOverlayClick);
    overlay.removeEventListener('modal:open', handleOpenEvent);
    document.removeEventListener('keydown', handleKeydown);
    initializedModals.delete(overlay);
  };

  const controller = { open, close, destroy };
  closeButton.addEventListener('click', close);
  overlay.addEventListener('click', handleOverlayClick);
  overlay.addEventListener('modal:open', handleOpenEvent);
  document.addEventListener('keydown', handleKeydown);
  initializedModals.set(overlay, controller);

  return controller;
}
