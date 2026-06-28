# Runtime Configuration

Verge Kit separates committed runtime defaults, local secrets, and deployed
secrets. Keep that boundary clear so local development, CI, and Cloudflare
Workers deployments behave the same way without leaking credentials.

## Committed Worker Variables

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
    "EMAIL_REPLY_TO": "support@example.com",
    "MAILGUN_DOMAIN": "mg.example.com",
  },
}
```

Typical non-secret values include:

- `APP_NAME`
- `DATABASE_TARGET`
- `EMAIL_PROVIDER`
- `EMAIL_FROM`
- `EMAIL_REPLY_TO`
- `BETTER_AUTH_URL`
- `MAILGUN_DOMAIN`

Do not put secret values in `wrangler.jsonc`.

If you use named Wrangler environments, define the `vars` block inside each
environment because Wrangler does not inherit `vars` from the top level.

## Local Secrets

Copy the local example and fill in values:

```bash
cp .dev.vars.example .dev.vars
```

Use `.dev.vars` for local-only secrets such as `BETTER_AUTH_SECRET`, email API
keys, and local callback URLs. You can also use it for local-only overrides of
non-secret values from `wrangler.jsonc`.

```bash
BETTER_AUTH_SECRET=your-local-secret
BETTER_AUTH_URL=http://localhost:4321
RESEND_API_KEY=your-local-resend-key
MAILGUN_API_KEY=your-local-mailgun-key
MAILGUN_DOMAIN=mg.example.com
```

Do not commit `.dev.vars`.

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

## Provider Defaults

The default email provider is `console`, which logs auth emails in local
development and tests. Configure `EMAIL_PROVIDER`, `EMAIL_FROM`, and any
provider-specific values before expecting real email delivery.

The default database target is `d1`. D1 is the only supported runtime database;
PostgreSQL and MySQL remain proof targets only.
