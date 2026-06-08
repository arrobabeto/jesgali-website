## Browser Verification

Verified against local dev server with the real `PUBLIC_WEB3FORMS_ACCESS_KEY` from `.env`.

### Forms Submitted

- Contact form at `/contacto` with dummy data.
- Spontaneous application form at `/vacantes#cv-espontaneo` with dummy data.
- Vacancy application form at `/vacantes/analista-operaciones#aplicar` with dummy data.

### Keyboard and Focus Results

- Each successful submission opened its confirmation modal.
- Each open modal exposed `role="dialog"`, `aria-modal="true"`, and valid `aria-labelledby` / `aria-describedby` references.
- Focus moved inside the dialog on open.
- `Tab` from the close button wrapped to the email link.
- `Shift+Tab` from the email link wrapped to the close button.
- Focus stayed inside the dialog while open.
- Background scroll was locked while open.
- Closing restored background scroll and returned focus to the submit button.

### Close Mechanisms

- `/contacto`: closed with `Escape`.
- `/vacantes#cv-espontaneo`: closed with the visible close button.
- `/vacantes/analista-operaciones#aplicar`: closed with a direct overlay click.
- Card/internal click behavior is covered by `tests/modal.test.ts`.

### HTML Verification

- `npm run build` passed with local `.env`.
- `npm run verify:modal-html` passed for:
  - `dist/contacto/index.html`
  - `dist/vacantes/index.html`
  - one generated vacancy detail page

### WCAG Mapping

- 1.3.1 Info and Relationships: dialog title and description are programmatically associated.
- 2.1.1 Keyboard: open dialogs can be navigated and closed by keyboard.
- 2.1.2 No Keyboard Trap: focus remains contained while open and can exit by closing the dialog.
- 2.4.3 Focus Order: focus moves into the dialog and returns to the opener.
- 2.4.7 Focus Visible: dialog focus uses a visible focus outline.
- 4.1.2 Name, Role, Value: dialog role, modality, name and description are exposed.
- 2.3.3 Animation from Interactions: `prefers-reduced-motion: reduce` disables the modal entrance animation.
