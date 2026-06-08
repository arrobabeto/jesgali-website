import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const pages = [
  'src/pages/contacto.astro',
  'src/pages/vacantes/index.astro',
  'src/pages/vacantes/[slug].astro',
];

describe.each(pages)('%s', (page) => {
  it('keeps the native Web3Forms fallback and enhanced status contract', async () => {
    const source = await readFile(page, 'utf8');

    expect(source).toContain('action="https://api.web3forms.com/submit"');
    expect(source).toContain('method="POST"');
    expect(source).toContain('name="botcheck"');
    expect(source).toContain('name="access_key" value={web3formsAccessKey}');
    expect(source).toContain('role="status" aria-live="polite"');
    expect(source).toContain('initWeb3Forms');
    expect(source).not.toMatch(/fetch\(['"]https:\/\/api\.web3forms\.com\/submit/);
  });
});

describe('vacancy application metadata', () => {
  it('preserves vacancy id and title fields', async () => {
    const source = await readFile('src/pages/vacantes/[slug].astro', 'utf8');

    expect(source).toContain('name="vacante_id" value={id}');
    expect(source).toContain('name="vacante_titulo" value={titulo}');
    expect(source).toContain('Aplicación: ${titulo} (${id})');
  });
});
