import { defineMiddleware } from "astro:middleware";

const homeTitle = "Verge Kit - Start new apps with low effort & high confidence";

const replaceTitleMetadata = (html: string) =>
  html
    .replace(/<title>.*?<\/title>/, `<title>${homeTitle}</title>`)
    .replace(
      /<meta name="title" content="[^"]*"\s*\/?>/,
      `<meta name="title" content="${homeTitle}">`,
    )
    .replace(
      /<meta property="og:title" content="[^"]*"\s*\/?>/,
      `<meta property="og:title" content="${homeTitle}">`,
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:title" content="${homeTitle}">`,
    );

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  if (
    context.url.pathname !== "/" ||
    !response.headers.get("content-type")?.includes("text/html")
  ) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.delete("content-length");

  return new Response(replaceTitleMetadata(await response.text()), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});
