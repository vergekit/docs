// @ts-check
import { defineConfig } from 'astro/config';
import reallySimpleDocs from 'reallysimpledocs/astro';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://vergekit.com',
  prefetch: true,
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
        SidebarFooter: './src/components/SidebarFooter.astro',
      },
      site: {
        title: 'Verge Kit',
        subtitle: 'v0.1.4',
        description: 'Start new apps with low effort and high confidence. Verge Kit is a full-stack Astro starter for Cloudflare Workers with the essentials pre-wired.',
        url: 'https://vergekit.com',
        socialImage: '/og-verge-kit.png',
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
