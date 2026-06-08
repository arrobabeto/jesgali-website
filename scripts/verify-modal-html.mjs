import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const root = process.cwd();
const vacanciesRoot = path.join(root, 'dist', 'vacantes');
const vacancyEntries = await readdir(vacanciesRoot, { withFileTypes: true });
const detailDirectory = vacancyEntries.find(entry => entry.isDirectory());

if (!detailDirectory) {
  throw new Error('No se encontró una página generada de detalle de vacante.');
}

const pages = [
  {
    file: path.join(root, 'dist', 'contacto', 'index.html'),
    modalId: 'modal-contacto',
  },
  {
    file: path.join(root, 'dist', 'vacantes', 'index.html'),
    modalId: 'modal-cv',
  },
  {
    file: path.join(vacanciesRoot, detailDirectory.name, 'index.html'),
    modalId: 'modal-aplicar',
  },
];

for (const { file, modalId } of pages) {
  const html = await readFile(file, 'utf8');
  const closingBody = html.toLowerCase().lastIndexOf('</body>');
  const closingHtml = html.toLowerCase().lastIndexOf('</html>');
  const modalPosition = html.indexOf(`id="${modalId}"`);

  if (modalPosition < 0 || modalPosition > closingBody) {
    throw new Error(`${modalId} no está dentro de <body> en ${file}.`);
  }

  if (html.slice(closingHtml + 7).trim() !== '') {
    throw new Error(`Hay contenido después de </html> en ${file}.`);
  }

  const document = new JSDOM(html).window.document;
  const modal = document.getElementById(modalId);
  const dialog = modal?.querySelector('[role="dialog"]');

  if (!modal || !document.body.contains(modal)) {
    throw new Error(`${modalId} no es descendiente de <body> en ${file}.`);
  }

  if (!dialog || dialog.getAttribute('aria-modal') !== 'true') {
    throw new Error(`${modalId} no expone un diálogo modal en ${file}.`);
  }

  for (const attribute of ['aria-labelledby', 'aria-describedby']) {
    const reference = dialog.getAttribute(attribute);
    if (!reference || document.querySelectorAll(`#${reference}`).length !== 1) {
      throw new Error(`${attribute} no resuelve a un ID único en ${file}.`);
    }
  }

  const ids = Array.from(document.querySelectorAll('[id]'), element => element.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    throw new Error(`IDs duplicados en ${file}: ${[...new Set(duplicateIds)].join(', ')}`);
  }
}

console.log(`HTML modal válido en ${pages.length} páginas.`);
