# Deployment

VK deploys as an Astro server app on Cloudflare Workers.

Keep committed runtime config in Workers bindings and `wrangler.jsonc` vars.
Keep local secret values in `.dev.vars`, and set deployed secret values with
Wrangler secrets.

## 1. Preflight

Run the same verification command locally and in CI:

```bash
npm run verify
```

This runs type checking, linting, tests, and the production build.

Build directly when investigating adapter or bundling issues:

```bash
npm run build
```

## 2. Create D1

Create the remote database:

```bash
npx wrangler d1 create vk
```

Copy the returned `database_id` into `wrangler.jsonc`:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "vk",
      "database_id": "your-d1-database-id",
      "migrations_dir": "drizzle/d1",
    },
  ],
}
```

## 3. Configure Runtime Variables

Use `wrangler.jsonc` as the committed source of truth for non-secret app-level
Worker variables:

```jsonc
{
  "vars": {
    "APP_NAME": "VK",
    "DATABASE_TARGET": "d1",
    "EMAIL_PROVIDER": "console",
    "BETTER_AUTH_URL": "https://example.com",
    "EMAIL_FROM": "VK <noreply@example.com>",
    "MAILGUN_DOMAIN": "mg.example.com",
  },
}
```

If you use named Wrangler environments, define the `vars` block inside each
environment because Wrangler does not inherit `vars` from the top level.

## 4. Set Secrets

Generate a stable Better Auth secret:

```bash
openssl rand -base64 32
```

Set it in Cloudflare:

```bash
npx wrangler secret put BETTER_AUTH_SECRET
```

If you deploy with a named Wrangler environment, pass the environment name:

```bash
npx wrangler secret put BETTER_AUTH_SECRET --env production
```

List configured secret names when auditing an environment:

```bash
npx wrangler secret list
npx wrangler secret list --env production
```

## 5. Configure Email

Set `EMAIL_PROVIDER` in `wrangler.jsonc`:

```jsonc
{
  "vars": {
    "EMAIL_PROVIDER": "resend",
  },
}
```

Set provider secrets:

```bash
npx wrangler secret put RESEND_API_KEY
```

For Mailgun:

```bash
npx wrangler secret put MAILGUN_API_KEY
```

Set `MAILGUN_DOMAIN` in `wrangler.jsonc` unless an environment needs a
local-only override.

For Cloudflare Email, configure the `EMAIL` binding and verified sending domain
in Cloudflare.

## 6. Migrate

Apply remote D1 migrations:

```bash
npm run db:migrate:remote
```

Optionally create a verified remote admin user after migrations:

```bash
npm run init:admin -- --remote
```

This writes directly to the remote D1 database with Wrangler and does not require
the app server to be running.

## 7. Verify

Run the full verification suite again before deployment:

```bash
npm run verify
```

## 8. Deploy

Build and deploy with Wrangler:

```bash
npm run build
npx wrangler deploy
```

Use your normal Cloudflare project workflow if deployment is handled by CI.

## Checklist

1. Create the D1 database with `wrangler d1 create vk`.
2. Update the D1 `database_id` in `wrangler.jsonc`.
3. Configure non-secret app values in `wrangler.jsonc`.
4. Configure `BETTER_AUTH_SECRET` and provider credentials with
   `wrangler secret put`.
5. Run `npm run db:migrate:remote`.
6. Optionally create a verified admin user with
   `npm run init:admin -- --remote`.
7. Run `npm run verify`.
8. Deploy with Wrangler or CI.
