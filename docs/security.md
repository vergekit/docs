# Security

Verge Kit includes security defaults for requests, sessions, redirects, roles, and secrets. These defaults do not replace application access rules.

## Request Origins

Astro origin checks are active in `astro.config.mjs`.

For form content, Astro compares the `Origin` header with the request URL. A mismatch returns a `403` response.

The rule applies to `POST`, `PUT`, `PATCH`, and `DELETE` requests. Read the [Astro security configuration](https://docs.astro.build/en/reference/configuration-reference/#securitycheckorigin) for the complete rules.

## Cross-Origin Requests

Astro origin checks do not configure Cross-Origin Resource Sharing (CORS). The `security.checkOrigin` option supplies Cross-Site Request Forgery (CSRF) protection.

The starter does not add CORS response headers. Browser clients on another origin cannot read API responses by default.

If another origin must use an API route, add CORS headers only to that route:

1. Use an exact list of allowed origins.
2. Handle `OPTIONS` preflight requests.
3. Return only the required methods and request headers.
4. If the response origin changes by request, add `Vary: Origin`.
5. If the request includes cookies, return an exact origin and `Access-Control-Allow-Credentials: true`.
6. Do not use `Access-Control-Allow-Origin: *` for cookie requests.

Keep `security.checkOrigin` active.

CORS does not replace CSRF protection, authentication, or authorization.

The starter does not support a separate frontend with cookie authentication by default. This architecture needs explicit origin and cookie configuration in Better Auth.

Bucket CORS is separate from Worker API CORS.

Add bucket rules only for direct requests from a browser to a bucket.

The starter has no R2 binding or direct-upload flow.

If you add this flow, read the [Cloudflare R2 CORS guide](https://developers.cloudflare.com/r2/buckets/cors/).

## Session Access

Routes are public by default. Add each protected route to the policy in `src/config/auth.ts`.

A session cookie does not grant access by itself. Middleware reads the session from Better Auth before it permits a protected request.

Admin routes use an authoritative session query. The starter does not enable Better Auth cookie caching for role and ban data.

Read the Better Auth [session guide](https://better-auth.com/docs/concepts/session-management) for session expiration and session functions.

## Permissions and Data

Authentication identifies a user. Authorization controls the data and actions that the user can access.

Keep authentication decisions, database writes, and email delivery in server code.

Parse all request input in server code before you use it.

A protected route permits all signed-in users. Use an admin route or `userHasAppPermission()` for sensitive data.

These rules do not control access to individual records. Read [Access Control](/auth/#access-control) for record-level rules.

Banned users cannot create sessions. Middleware also denies their access to protected routes.

## Redirects

Auth form redirects must use the current origin. Sign-out redirects must start with one slash and cannot start with two slashes.

These rules prevent an auth flow from redirecting a user to an external site.

## Secrets and Email

Keep `BETTER_AUTH_SECRET` stable for each environment. Store it in `.dev.vars` locally and in Wrangler secrets for deployment.

Do not put secrets in `wrangler.jsonc` or source files. See the [Configuration Guide](/configuration) for the storage locations.

Use a delivered email provider in production. Make sure that `EMAIL_FROM` uses a verified sender or domain.
