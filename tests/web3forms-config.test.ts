import { describe, expect, it } from 'vitest';
import {
  isValidWeb3FormsAccessKey,
  requireWeb3FormsAccessKey,
} from '../src/lib/web3forms-config.mjs';

describe('Web3Forms environment validation', () => {
  it('accepts and trims a configured access key', () => {
    expect(requireWeb3FormsAccessKey('  test-access-key-123  ')).toBe('test-access-key-123');
  });

  it.each([undefined, '', '   ', 'TU_ACCESS_KEY_WEB3FORMS', 'your-web3forms-access-key'])(
    'rejects missing or placeholder values: %s',
    (value) => {
      expect(isValidWeb3FormsAccessKey(value)).toBe(false);
      expect(() => requireWeb3FormsAccessKey(value)).toThrow('PUBLIC_WEB3FORMS_ACCESS_KEY');
    },
  );
});
