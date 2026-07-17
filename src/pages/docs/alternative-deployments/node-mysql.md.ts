import source from '../../../../docs/alternative-deployments/node-mysql.mdx?raw';

export const prerender = true;

export function GET() {
  const markdown = source.replace(
    /^---\s*\n[\s\S]*?\n---\s*\n/,
    '# Node.js + MySQL\n\n',
  );

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}
