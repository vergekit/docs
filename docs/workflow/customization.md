# Customization

Verge Kit is meant to be changed at the application boundary while keeping the
platform wiring stable. Prefer small, local edits that keep Astro, Cloudflare,
Drizzle, Better Auth, Tailwind, and the existing helper modules as the main
surface area.

## Branding

Set the application name in `src/config/app.ts`:

```ts
export const appConfig = {
  name: 'Acme',
  defaultAuthenticatedPath: '/dashboard',
} as const;
```

## Configuration

Source-level app defaults and auth policy belong in `src/config`. Non-secret
Worker runtime values belong in `wrangler.jsonc`; local secrets belong in
`.dev.vars`; deployed secrets belong in Wrangler secrets.

Common values to customize:

- `BETTER_AUTH_URL`
- `EMAIL_PROVIDER`
- `EMAIL_FROM`
- `EMAIL_REPLY_TO`
- `MAILGUN_DOMAIN`

Do not put `BETTER_AUTH_SECRET`, email API keys, or Cloudflare API tokens in
`wrangler.jsonc`.

## Auth Routes

Add globally protected pages and API namespaces in `src/config/auth.ts`.

Use exact paths for individual pages:

```ts
export const authRouteConfig = {
  protectedExactPaths: ['/dashboard', '/account'],
  protectedPrefixes: [],
  // ...
} as const;
```

Use slash-terminated prefixes for route groups:

```ts
export const authRouteConfig = {
  protectedExactPaths: ['/dashboard'],
  protectedPrefixes: ['/settings/'],
  adminExactPaths: ['/admin'],
  adminPrefixes: ['/admin/'],
  // ...
} as const;
```

Use route-local checks when the route needs custom behavior, such as returning
JSON `401` from an API instead of redirecting to `/login`.

## Auth Email Templates

Auth verification and password reset email templates live under
`src/email/auth`. The render helpers in `src/auth/email.ts` render those React
Email templates, and auth email sender defaults are configured in
`src/config/auth.ts`.

Keep direct provider calls out of auth flows. Use
`createAuthEmailSenderFromEnv` for Better Auth email and `sendEmail` for custom
transactional email.

## UI Components

Local Astro UI components live under `src/components/ui`. Add project-specific
components there when they are shared across pages. Keep one-off page layout in
the page or a nearby component until it is clearly reused.

## Database Queries

App code should import the initialized `db` client from `@/db` instead of
importing a Drizzle driver directly. This keeps the D1-first runtime boundary
clear and preserves the path for future adapter work.
