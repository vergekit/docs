# Configuration Guide

Configuration is split by responsibility so project-specific edits stay small
and secrets stay out of the repo.

## What Goes Where

| Location | Use for | Examples |
| --- | --- | --- |
| `src/config/*.ts` | Source-level defaults, policies, and schema that app code imports. These are committed and typed. | App name, default authenticated path, protected routes, app roles, permission values, D1 table definitions. |
| `wrangler.jsonc` `vars` | Committed, non-secret Worker runtime values that can differ by deployed environment. | `EMAIL_PROVIDER`, `EMAIL_FROM`, `EMAIL_REPLY_TO`, `BETTER_AUTH_URL`, `MAILGUN_DOMAIN`. |
| `.dev.vars` | Local-only secrets and local-only overrides. Never commit this file. | `BETTER_AUTH_SECRET`, local `BETTER_AUTH_URL`, `RESEND_API_KEY`, `MAILGUN_API_KEY`, local email overrides. |
| Wrangler secrets | Deployed secret values managed by Cloudflare, not committed to git. | `BETTER_AUTH_SECRET`, `RESEND_API_KEY`, `MAILGUN_API_KEY`. |

This separation of concerns keeps editable source policy in `src/config`, runtime
environment selection in Wrangler config, and secret material outside committed
files.

## Source Config

Use `src/config` when changing values that the app code should import directly:

- `src/config/app.ts`: app identity and default navigation paths.
- `src/config/auth.ts`: middleware route policy, admin route policy, app roles,
  app permission values, browser auth fallback copy, and banned-session copy.
- `src/config/auth-email.ts`: transactional auth email rendering and sender
  defaults.
- `src/config/schema.ts`: Drizzle D1 table definitions shared by app code,
  Better Auth, and Drizzle Kit.

Email provider selection stays with `@vergekit/core/email`, while auth-email
sender defaults and rendering live in `src/config/auth-email.ts`, and the React
Email templates live under `src/email/auth`. Do not put environment secrets
here. Do not add runtime database target selection here; database target
selection should wait until Hyperdrive adapters are implemented.

## Worker Runtime Config

Use `wrangler.jsonc` for non-secret values the Worker reads from `env`:

```jsonc
{
  "vars": {
    "EMAIL_PROVIDER": "console"
  }
}
```

Named Wrangler environments need their own `vars` block because Wrangler does
not inherit top-level vars into environments.

## Local And Deployed Secrets

Use `.dev.vars` for local development secrets:

```bash
BETTER_AUTH_SECRET=replace-with-at-least-32-random-characters
BETTER_AUTH_URL=http://localhost:4321
RESEND_API_KEY=your-local-resend-key
MAILGUN_API_KEY=your-local-mailgun-key
MAILGUN_DOMAIN=mg.example.com
```

Use Wrangler secrets for deployed secrets:

```bash
npx wrangler secret put BETTER_AUTH_SECRET
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put MAILGUN_API_KEY
```

Wrangler prompts for each value without storing it in the repo. If you deploy a
named environment, pass the environment name:

```bash
npx wrangler secret put BETTER_AUTH_SECRET --env production
```

Only configure provider-specific secrets for the email provider the environment
actually uses.

## Application Customization

Verge Kit is meant to be changed at the application boundary while keeping the
platform wiring stable. Prefer small, local edits that keep Astro, Cloudflare,
Drizzle, Better Auth, Tailwind, and the existing helper modules as the main
surface area.

### Branding

Set the application name and default authenticated path in `src/config/app.ts`:

```ts
export const appConfig = {
  name: 'Acme',
  defaultAuthenticatedPath: '/dashboard',
} as const;
```

### Auth Routes

Add globally protected pages and API namespaces in `src/config/auth.ts`.

Use exact paths for individual pages:

```ts
export const authConfig = defineAuthConfig({
  routes: {
    protectedExactPaths: ['/dashboard', '/account'],
    protectedPrefixes: [],
    // ...
  },
  // ...
});
```

Use slash-terminated prefixes for route groups:

```ts
export const authConfig = defineAuthConfig({
  routes: {
    protectedExactPaths: ['/dashboard'],
    protectedPrefixes: ['/settings/'],
    adminExactPaths: ['/admin'],
    adminPrefixes: ['/admin/'],
    // ...
  },
  // ...
});
```

Use route-local checks when the route needs custom behavior, such as returning
JSON `401` from an API instead of redirecting to `/login`.

### Auth Email Templates

Auth verification and password reset email templates live under
`src/email/auth`. Transactional auth email rendering and sender defaults are
configured in `src/config/auth-email.ts`.

Keep direct provider calls out of auth flows. Use
`createAuthEmailSenderFromEnv` for Better Auth email and `sendEmail` for custom
transactional email.

### UI Components

Local Astro UI components live under `src/components/ui`. Add project-specific
components there when they are shared across pages. Keep one-off page layout in
the page or a nearby component until it is clearly reused.

### Database Queries

App code should import the initialized `db` client from `@/db` instead of
importing a Drizzle driver directly. This keeps the D1-first runtime boundary
clear and preserves the path for future adapter work.
