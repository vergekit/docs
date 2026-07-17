declare module 'reallysimpledocs/astro' {
  import type { AstroIntegration } from 'astro';

  interface ReallySimpleDocsOptions {
    docsDir?: string;
    routeBase?: string;
    style?: 'vega' | 'nova' | 'maia' | 'lyra' | 'mira' | 'luma' | 'sera' | 'rhea';
    css?: boolean;
    customCss?: string | string[];
    bodyAttrs?: Record<string, unknown>;
    components?: Partial<
      Record<
        'Head' | 'SidebarHeader' | 'SidebarFooter' | 'ContentHeader',
        string
      >
    >;
    site?: Record<string, unknown>;
    siteFile?: string;
    assetsBase?: string;
  }

  export default function reallySimpleDocs(
    options?: ReallySimpleDocsOptions,
  ): AstroIntegration;
}

declare module 'reallysimpledocs/components' {
  export const DocsLayout: import('astro/runtime/server/index.js').AstroComponentFactory;
}
