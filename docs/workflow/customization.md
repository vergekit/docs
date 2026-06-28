# Customization

Verge Kit is meant to be changed at the application boundary while keeping the
platform wiring stable. Prefer small, local edits that keep Astro, Cloudflare,
Drizzle, Better Auth, Tailwind, and the existing helper modules as the main
surface area.

## Branding

Set the application name in `wrangler.jsonc`:

```jsonc
{
  "vars": {
    "APP_NAME": "Acme",
  },
}
```

Use the same value in deployed environment `vars` blocks if you use named
Wrangler environments.

## Runtime Configuration

Non-secret defaults belong in `wrangler.jsonc`; local secrets belong in
`.dev.vars`; deployed secrets belong in Wrangler secrets.

Common values to customize:

- `APP_NAME`
- `BETTER_AUTH_URL`
- `EMAIL_PROVIDER`
- `EMAIL_FROM`
- `EMAIL_REPLY_TO`
- `MAILGUN_DOMAIN`

Do not put `BETTER_AUTH_SECRET`, email API keys, or Cloudflare API tokens in
`wrangler.jsonc`.

## Auth Routes

Add globally protected pages and API namespaces in `src/auth/routes.ts`.

Use exact paths for individual pages:

```ts
const protectedExactPaths = new Set(['/dashboard', '/account']);
```

Use slash-terminated prefixes for route groups:

```ts
const protectedPrefixes: string[] = ['/settings/', '/admin/'];
```

Use route-local checks when the route needs custom behavior, such as returning
JSON `401` from an API instead of redirecting to `/login`.

## Auth Email Templates

Auth verification and password reset email templates live under
`src/email/templates/auth`. The auth email helper renders those templates and
sends through the configured provider.

Keep direct provider calls out of auth flows. Use
`createAuthEmailSenderFromEnv` for Better Auth email and `sendEmail` for custom
transactional email.

## UI Components

Local Astro UI components live under `src/components/ui`. Add project-specific
components there when they are shared across pages. Keep one-off page layout in
the page or a nearby component until it is clearly reused.

## Database Queries

App code should call local query helpers under `src/db` instead of importing a
Drizzle driver directly. This keeps the D1-first runtime boundary clear and
preserves the path for future adapter work.
