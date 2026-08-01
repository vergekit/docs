// @ts-check
import { defineConfig } from 'astro/config';
import reallySimpleDocs from 'reallysimpledocs/astro';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  redirects: {
    '/docs/auth-routes': '/docs/auth/routes/',
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light-default',
      wrap: true,
    },
  },
  integrations: [
    reallySimpleDocs({
      docsDir: './docs',
      routeBase: '/',
      bodyAttrs: {
        'data-pagefind-body': true,
        'data-theme-mode': 'light-only',
      },
      style: 'vega',
      css: false,
      components: {
        Head: './src/components/DocsHead.astro',
        ContentHeader: './src/components/ContentHeader.astro',
      },
      site: {
        title: 'Verge Kit',
        subtitle: 'v0.1.4',
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
