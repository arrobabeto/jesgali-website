import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jesgali.com.mx',
  output: 'static',
  integrations: [
    tailwind(),
    mdx(),
    sitemap(),
  ],
});
