import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';
import { requireWeb3FormsAccessKey } from './src/lib/web3forms-config.mjs';

const isBuild = process.argv.includes('build');
const modeFlagIndex = process.argv.indexOf('--mode');
const mode = modeFlagIndex >= 0 ? process.argv[modeFlagIndex + 1] : isBuild ? 'production' : 'development';
const env = loadEnv(mode, process.cwd(), '');

if (isBuild && mode === 'production') {
  requireWeb3FormsAccessKey(env.PUBLIC_WEB3FORMS_ACCESS_KEY);
}

export default defineConfig({
  site: 'https://jesgali.com.mx',
  output: 'static',
  integrations: [
    tailwind(),
    mdx(),
    sitemap(),
  ],
});
