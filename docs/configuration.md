# Configuration

## Configuration Locations

| Location | Use | Examples |
| --- | --- | --- |
| `src/config/*.ts` | Committed application policy and schemas | App name, routes, roles, permissions, D1 tables |
| `wrangler.jsonc` `vars` | Committed Worker values | `EMAIL_PROVIDER`, `EMAIL_FROM`, `BETTER_AUTH_URL` |
| `.dev.vars` | Local secrets and overrides | `BETTER_AUTH_SECRET`, API keys |
| Wrangler secrets | Deployed secrets | `BETTER_AUTH_SECRET`, API keys |

## Application Configuration

Files in `src/config` contain values that application code imports:

- `src/config/app.ts` contains the application name and default authenticated path.
- `src/config/auth.ts` contains route rules, roles, permissions, and authentication messages.
- `src/config/auth-email.ts` contains email sender defaults and render functions.
- `src/config/schema.ts` contains the D1 table definitions.

Do not put sensitive secrets in these files.

Set the application name and default authenticated path in `src/config/app.ts`:

```ts
export const appConfig = {
  name: 'Acme',
  defaultAuthenticatedPath: '/dashboard',
} as const;
```

## Worker Variables

Use `wrangler.jsonc` for Worker values that are not secret:

```jsonc
{
  "vars": {
    "EMAIL_PROVIDER": "console"
  }
}
```

Each named Wrangler environment needs its own `vars` block. Wrangler does not inherit these values from the top level.

## Local Secrets

Put local secrets in `.dev.vars`:

```bash
BETTER_AUTH_SECRET=replace-with-at-least-32-random-characters
BETTER_AUTH_URL=http://localhost:4321
RESEND_API_KEY=your-local-resend-key
MAILGUN_API_KEY=your-local-mailgun-key
MAILGUN_DOMAIN=mg.example.com
```


## Deployed Secrets

Use Wrangler to add deployed secrets:

```bash
npx wrangler secret put BETTER_AUTH_SECRET
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put MAILGUN_API_KEY
```

For a named environment, include its name:

```bash
npx wrangler secret put BETTER_AUTH_SECRET --env production
```

Add only the secrets that the selected provider requires.

## Runtime Modules

`src/runtime.ts` exports the runtime environment for server code. This module is the application boundary for platform bindings.

`src/db.ts` uses that environment to create the application database. Import `db` from `@/db` instead of creating a second client.

If you add a Worker binding, add its type to `src/env.d.ts`. Then add the binding to `wrangler.jsonc`.

The Astro configuration names a `SESSION` KV binding for Astro Sessions. The starter auth flow uses Better Auth sessions and does not use `Astro.session`.

If the application uses Astro Sessions, add and type the `SESSION` binding. Otherwise, the Better Auth flow does not require this binding.

## Starter Files

- `src/pages/api/health.ts` returns the standard JSON success shape.
- `src/pages/api/debug/email.ts` contains a disabled email delivery example.
- `src/pages/404.astro` and `src/pages/500.astro` supply error pages.
- `src/components/Favicon.astro` supplies favicon metadata.
- `src/actions/index.ts` is the empty registry for Astro Actions.

## Favicons and Branding

Replace `public/favicon.svg` with the artwork for your application.

The production build uses this SVG to create `favicon.ico` and `apple-touch-icon.png`. `src/components/Favicon.astro` adds all three icon links to each page.

The boilerplate also uses `public/favicon.svg` as visible artwork. The home page, authentication pages, and authenticated layout contain these image references by default.

Icon variants and background colors can be changed in `astro.config.mjs`.


## Related Configuration

- See [Authentication](/auth/) for the included auth flow
- See [Route Protection](/auth/routes) for protected routes and permissions
- See [Security](/security) for request and session safeguards
- See [Email](/email) for email providers and templates
- See [D1 Setup](/database) for schemas and migrations
