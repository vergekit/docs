import { resources } from "../../utils/resources";

export const prerender = true;

const description =
  "Some of our preferred libraries, tools, and references for building with Verge Kit.";

const escapeTableCell = (value: string) =>
  value.replaceAll("|", "\\|").replaceAll(/\s+/g, " ").trim();

export function GET() {
  const rows = [...resources]
    .sort((a, b) => a.title.localeCompare(b.title))
    .map(
      (resource) =>
        `| [${escapeTableCell(resource.title)}](${resource.url}) | ${escapeTableCell(resource.description)} | ${escapeTableCell(resource.tags.join(", "))} |`,
    );

  const markdown = [
    "# Resources",
    "",
    description,
    "",
    "| Resource | Description | Tags |",
    "| --- | --- | --- |",
    ...rows,
    "",
  ].join("\n");

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
