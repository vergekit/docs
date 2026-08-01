import source from '../../../../docs/presets/node-mysql.mdx?raw';

export const prerender = true;

export function GET() {
  const markdown = source.replace(
    /^---\s*\n[\s\S]*?\n---\s*\n/,
    '# Node.js + MySQL Preset\n\n',
  );

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}
