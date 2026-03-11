import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://ruiqing.wang',
  integrations: [mdx(), sitemap()],
  output: 'static',
  adapter: vercel(),
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
