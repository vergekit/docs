# Installation

## Requirements

- Node.js
- npm
- OpenSSL for local secret generation
- Wrangler through the project dependency
- A Cloudflare account for remote D1 and deployment

## Create A Project

Create a new app:

```bash
npm create vergekit@latest my-app
```

Verge Kit is Cloudflare-first, so the no-flag command creates the default
Workers + D1 application. Using the self-hosted Node.js + MySQL preset? See the
[Node.js + MySQL guide](/docs/alternative-deployments/node-mysql).

Install dependencies:

```bash
cd my-app
npm install
```

## Local Runtime Secrets

Create local runtime secrets. The paste-free option copies the template and
writes a fresh Better Auth secret:

```bash
cp .dev.vars.example .dev.vars && secret="$(openssl rand -base64 32)" && awk -v secret="$secret" 'BEGIN { done = 0 } /^BETTER_AUTH_SECRET=/ { print "BETTER_AUTH_SECRET=" secret; done = 1; next } { print } END { if (!done) print "BETTER_AUTH_SECRET=" secret }' .dev.vars > .dev.vars.tmp && mv .dev.vars.tmp .dev.vars
```

Or copy the file and fill the secret manually:

```bash
cp .dev.vars.example .dev.vars
```

Generate a Better Auth secret:

```bash
openssl rand -base64 32
```

Add it to `.dev.vars`:

```bash
BETTER_AUTH_SECRET=your-generated-secret
```

Local callback URLs usually stay in `.dev.vars`:

```bash
BETTER_AUTH_URL=http://localhost:4321
```

Committed, non-secret app defaults live in `wrangler.jsonc` under `vars`. Use
`.dev.vars` only for local secrets or local-only overrides.

## Database

Apply local D1 migrations:

```bash
npm run db:migrate:local
```

Regenerate migrations after schema changes:

```bash
npm run db:generate
```

Optionally create a verified local user with the `admin` role after migrations:

```bash
npm run init:admin
```

This writes directly to D1 with Wrangler and does not require `npm run dev`.

Local dev uses Wrangler/Miniflare-backed D1 state through the
Astro Cloudflare adapter; no separate Miniflare config is required after
`npm install`.

See [D1 Setup](/docs/setup/d1) for production database setup, Drizzle Studio
notes, and alternate local or Cloudflare-hosted development database options.

## Auth Routes

All routes are public until they opt into auth. Add protected exact paths or URL
prefixes in `src/config/auth.ts`, or call
`await Astro.locals.loadAuthSession()` before checking auth inside a specific
public page or route handler.

See [Route Authentication](/docs/setup/auth-routes) for middleware-protected and
route-local examples.

Better Auth policy is configured in `src/config/auth.ts`, and
`@vergekit/core/auth` builds the runtime Better Auth options and plugins from
that policy. The admin plugin is already installed and configured for the app
role model. See [Route Authentication](/docs/setup/auth-routes) for the files
that usually need to change when adding or modifying Better Auth plugins.

## Email

The default local email provider is `console`.

Use it for local setup when you only need links printed to the terminal:

```bash
EMAIL_PROVIDER=console
```

For full auth behavior with delivered verification and reset emails, configure a
real provider before testing auth:

```bash
EMAIL_PROVIDER=resend
EMAIL_FROM="VK <noreply@example.com>"
RESEND_API_KEY=your-api-key
```

Mailgun uses:

```bash
EMAIL_PROVIDER=mailgun
EMAIL_FROM="VK <noreply@example.com>"
MAILGUN_API_KEY=your-api-key
MAILGUN_DOMAIN=mg.example.com
```

Cloudflare Email uses the `EMAIL` binding from `wrangler.jsonc`.

See [Email Sending](/docs/setup/email) for direct send examples, provider
requirements, auth-email helpers, and testing notes.

## Configuration

Editable app defaults and auth policy live in `src/config`. Runtime Worker
values live in `wrangler.jsonc` vars. Local secrets live in `.dev.vars`, and
deployed secrets live in Wrangler secrets.

See [Configuration Guide](/docs/setup/runtime-configuration) for the full split.

## Run

Start the dev server:

```bash
npm run dev
```

Run the full local check:

```bash
npm run verify
```

`npm run verify` runs type checks, linting, tests, and the production build.
