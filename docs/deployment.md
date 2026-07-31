# Deployment Setup

VK deploys as an Astro server app on Cloudflare Workers. Keep committed runtime
config in Workers bindings and `wrangler.jsonc` vars. Keep local secret values
in `.dev.vars`, and set deployed secret values with Wrangler secrets. See
[Configuration Guide](/docs/runtime-configuration) for the separation of
concerns between `src/config`, `wrangler.jsonc`, `.dev.vars`, and Wrangler
secrets.

Using the self-hosted Node.js + MySQL preset? Follow the
[Node.js + MySQL guide](/docs/alternative-deployments/node-mysql) instead.
Workers and D1 remain the default and primary deployment path.

## Preflight

Run the same verification command locally and in CI:

```bash
npm run verify
```

This runs type checking, linting, tests, and the production build.

Build directly when investigating adapter or bundling issues:

```bash
npm run build
```

## Runtime Variables

Use `wrangler.jsonc` as the committed source of truth for non-secret app-level
Worker variables:

```jsonc
{
  "vars": {
    "EMAIL_PROVIDER": "console",
    "BETTER_AUTH_URL": "https://example.com",
    "EMAIL_FROM": "VK <noreply@example.com>",
    "MAILGUN_DOMAIN": "mg.example.com",
  },
}
```

Typical non-secret runtime values are `EMAIL_PROVIDER`, `EMAIL_FROM`,
`EMAIL_REPLY_TO`, `BETTER_AUTH_URL`, and `MAILGUN_DOMAIN`. App identity and
route policy live in `src/config`. If you use named Wrangler environments,
define the `vars` block inside each environment because Wrangler does not
inherit `vars` from the top level.

## Local Secrets

Copy the local example and fill in values:

```bash
cp .dev.vars.example .dev.vars
```

Use `.dev.vars` for local-only secrets such as `BETTER_AUTH_SECRET`, email API
keys, and local callback URLs. You can also use it for local-only overrides of
non-secret values from `wrangler.jsonc`. Do not commit `.dev.vars`.

## Deployed Secrets

Set deployed secrets with Wrangler. Better Auth always needs a stable secret:

```bash
npx wrangler secret put BETTER_AUTH_SECRET
```

Set provider-specific email secrets only when the selected provider needs them:

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put MAILGUN_API_KEY
```

Wrangler prompts for each value. Do not pass secret values as command arguments,
print them in shell history, or commit them to `wrangler.jsonc`.

If you deploy with a named Wrangler environment, pass the environment name when
setting the secret:

```bash
npx wrangler secret put BETTER_AUTH_SECRET --env production
```

List configured secret names when auditing an environment:

```bash
npx wrangler secret list
npx wrangler secret list --env production
```

## Release Checklist

Use this checklist before deploying a Verge Kit application to Cloudflare
Workers.

### Local Verification

- Run the full verification suite with `npm run verify`.
- Run `npm run build` separately when investigating adapter or bundling issues.

### Configuration

- Create the D1 database with `wrangler d1 create vk` if it does not exist.
- Confirm `wrangler.jsonc` contains the production D1 `database_id`.
- Confirm non-secret production values are in `wrangler.jsonc` or the named
  Wrangler environment.
- Confirm named Wrangler environments repeat their own `vars` blocks.
- Confirm `.dev.vars` has not been committed.

### Secrets

- Configure `BETTER_AUTH_SECRET` with `wrangler secret put`.
- Configure only the secrets required by the selected email provider.
- Include `--env production` when using a named production environment.
- Audit configured secret names with `npx wrangler secret list`.

### Database

- Apply remote D1 migrations with `npm run db:migrate:remote`.
- For the first production deploy, optionally create a verified remote user with
  the `admin` role using `npm run init:admin -- --remote`.

### Email

- Confirm `EMAIL_PROVIDER` matches the deployed environment.
- Confirm `EMAIL_FROM` uses a verified sender or domain for the provider.
- Confirm Cloudflare Email deployments have an `EMAIL` binding and verified
  sending domain.
- Confirm Resend or Mailgun deployments have the matching API key secret.

### Deploy

- Deploy with the project CI workflow or run `npx wrangler deploy`.
- After deployment, verify login, registration, email verification, password
  reset, and any protected routes that changed.
