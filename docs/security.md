# Security

Verge Kit includes defaults for requests, sessions, redirects, roles, and secrets. Your application still needs its own access rules.

## Requests and CORS

Astro origin checks are active in `astro.config.mjs`:

- A request returns `403` when its `Origin` header does not match the request URL.
- The check covers form-based `POST`, `PUT`, `PATCH`, and `DELETE` requests.
- Keep the check active for Cross-Site Request Forgery (CSRF) protection.

The starter does not add Cross-Origin Resource Sharing (CORS) headers:

- Add CORS only to routes that need cross-origin browser access.
- For requests with cookies, return an exact origin and `Access-Control-Allow-Credentials: true`.
- Do not use `*` for requests with cookies.

See the [Astro security configuration](https://docs.astro.build/en/reference/configuration-reference/#securitycheckorigin) and [Cloudflare Worker CORS example](https://developers.cloudflare.com/workers/examples/cors-header-proxy/) for details.

## Sessions and access

Routes are public by default:

- Add protected and administrator routes to the policy in `src/config/auth.ts`.
- Middleware loads the Better Auth session before it permits a protected request.
- Administrator routes always query the current session.
- The starter does not cache role or ban data in cookies.
- Banned users cannot create sessions or access protected routes.

Authentication identifies a user but does not control access to records:

- Apply permission and ownership rules in server code.
- Keep database writes and email delivery in server code.
- Parse all request input before use.

See [Access Control](/auth/#access-control) for route, permission, and record rules. See the Better Auth [session guide](https://better-auth.com/docs/concepts/session-management) for session configuration.

## Redirects

- Auth form redirects must use the current origin.
- Sign-out redirects must start with one slash and cannot start with two slashes.

These rules prevent an auth flow from redirecting a user to an external site.

## Secrets and email

- Keep `BETTER_AUTH_SECRET` stable for each environment.
- Store local secrets in `.dev.vars` and deployed secrets in Wrangler.
- Do not put secrets in `wrangler.jsonc` or source files.
- Use a delivered email provider in production.
- Set `EMAIL_FROM` to a verified sender or domain.

See the [Configuration Guide](/configuration) for secret storage instructions.
