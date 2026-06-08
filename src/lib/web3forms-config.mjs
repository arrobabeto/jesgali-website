export const WEB3FORMS_ENV_NAME = 'PUBLIC_WEB3FORMS_ACCESS_KEY';

const PLACEHOLDER_VALUES = new Set([
  'TU_ACCESS_KEY_WEB3FORMS',
  'YOUR-WEB3FORMS-ACCESS-KEY',
  'YOUR_ACCESS_KEY_HERE',
  'YOUR_WEB3FORMS_ACCESS_KEY',
]);

export function isValidWeb3FormsAccessKey(value) {
  if (typeof value !== 'string') return false;

  const normalized = value.trim();
  return normalized.length > 0 && !PLACEHOLDER_VALUES.has(normalized.toUpperCase());
}

export function requireWeb3FormsAccessKey(value) {
  if (!isValidWeb3FormsAccessKey(value)) {
    throw new Error(
      `[config] ${WEB3FORMS_ENV_NAME} es obligatoria para builds de producción. ` +
      'Configura una access key válida de Web3Forms en el entorno de build.',
    );
  }

  return value.trim();
}
