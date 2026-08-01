# Security

Verge Kit includes security defaults for requests, sessions, redirects, roles, and secrets. These defaults do not replace application access rules.

## Request Origins

Astro origin checks are active in `astro.config.mjs`.

For form content, Astro compares the `Origin` header with the request URL. A mismatch returns a `403` response.

The rule applies to `POST`, `PUT`, `PATCH`, and `DELETE` requests. Read the [Astro security configuration](https://docs.astro.build/en/reference/configuration-reference/#securitycheckorigin) for the complete rules.

## Session Access

Routes are public by default. Add each protected route to the policy in `src/config/auth.ts`.

A session cookie does not grant access by itself. Middleware reads the session from Better Auth before it permits a protected request.

Admin routes use an authoritative session query. The starter does not enable Better Auth cookie caching for role and ban data.

Read the Better Auth [session guide](https://better-auth.com/docs/concepts/session-management) for session expiration and session functions.

## Permissions and Data

Authentication identifies a user. Authorization controls the data and actions that the user can access.

A protected route permits all signed-in users. Use an admin route or `userHasAppPermission()` for sensitive data.

Banned users cannot create sessions. Middleware also denies their access to protected routes.

## Redirects

Auth form redirects must use the current origin. Sign-out redirects must start with one slash and cannot start with two slashes.

These rules prevent an auth flow from redirecting a user to an external site.

## Secrets and Email

Keep `BETTER_AUTH_SECRET` stable for each environment. Store it in `.dev.vars` locally and in Wrangler secrets for deployment.

Do not put secrets in `wrangler.jsonc` or source files. See the [Configuration Guide](/docs/configuration) for the storage locations.

Use a delivered email provider in production. Make sure that `EMAIL_FROM` uses a verified sender or domain.

## Features Not Included

The starter does not configure a durable application rate limiter. Add an edge or durable rate limit before a public launch.

The starter does not include OAuth, multi-factor authentication, passkeys, or a complete admin interface.

Read the [Better Auth security reference](https://better-auth.com/docs/reference/security) before you add a new authentication method.
