# Release Checklist

Use this checklist before deploying a Verge Kit application to Cloudflare
Workers.

## Local Verification

Run the full verification suite:

```bash
npm run verify
```

This runs Astro and TypeScript checks, linting, tests, and the production build.
Run `npm run build` separately when investigating adapter or bundling issues.

## Runtime Configuration

- Confirm `wrangler.jsonc` contains the production D1 `database_id`.
- Confirm non-secret production values are in `wrangler.jsonc` or the named
  Wrangler environment.
- Confirm named Wrangler environments repeat their own `vars` blocks.
- Confirm `.dev.vars` has not been committed.

## Secrets

Better Auth always needs a stable deployed secret:

```bash
npx wrangler secret put BETTER_AUTH_SECRET
```

Set provider secrets only for the email provider the environment uses:

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put MAILGUN_API_KEY
```

For named environments, include the environment flag:

```bash
npx wrangler secret put BETTER_AUTH_SECRET --env production
```

Audit configured secret names:

```bash
npx wrangler secret list
npx wrangler secret list --env production
```

## Database

Apply remote D1 migrations:

```bash
npm run db:migrate:remote
```

If this is the first production deploy, create a verified remote admin user:

```bash
npm run init:admin -- --remote
```

## Email

- Confirm `EMAIL_PROVIDER` matches the deployed environment.
- Confirm `EMAIL_FROM` uses a verified sender/domain for the provider.
- Confirm Cloudflare Email deployments have an `EMAIL` binding and verified
  sending domain.
- Confirm Resend or Mailgun deployments have the matching API key secret.

## Deploy

Deploy with Wrangler or the project CI workflow:

```bash
npm run build
npx wrangler deploy
```

After deployment, verify login, registration, email verification, password reset,
and any protected routes that changed.
