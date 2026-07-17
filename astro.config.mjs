// @ts-check
import { defineConfig } from 'astro/config';
import reallySimpleDocs from 'reallysimpledocs/astro';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  integrations: [
    reallySimpleDocs({
      docsDir: './docs',
      routeBase: '/docs',
      style: 'vega',
      css: false,
      components: {
        Head: './src/components/DocsHead.astro',
        ContentHeader: './src/components/ContentHeader.astro',
      },
      site: {
        title: 'Verge Kit Docs',
        subtitle: 'v0.1.3',
        description: 'Documentation for VergeKit.',
        logo: {
          url: '/vk-crane-a-white.svg',
        },
        assets: {
          favicon: '/favicon.svg'
        }
      }
    })
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
