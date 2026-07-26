# Installation

## Requirements

- Node.js 22.12 or newer
- npm
- Wrangler through the project dependency
- A Cloudflare account for remote D1 and deployment

## Create A Project

Run the interactive installer:

```bash
npm create vergekit@latest
```

It asks where to create the project and whether to use Cloudflare Workers + D1
or Node.js + MySQL. You can also provide the destination directly:

```bash
npm create vergekit@latest my-app
```

Verge Kit is Cloudflare-first, so Workers + D1 is the default. The guided D1
flow can install dependencies, create `.dev.vars` with a fresh Better Auth
secret, apply local migrations, and launch administrator creation. The secret is
generated with Node.js and is never printed.

The Node.js + MySQL flow creates `.env` with a fresh Better Auth secret, installs
dependencies, and presents one grouped connection step for the MySQL host,
port, database, user, and masked password. It can then run the migration and
administrator commands. See the
[Node.js + MySQL guide](/docs/alternative-deployments/node-mysql).

For scripts and CI, non-interactive terminals never prompt. With no setup flags,
the command only generates the project. Use `--yes` for dependency installation
and local D1 migration, or choose stages explicitly:

```bash
npm create vergekit@latest my-app -- --yes
npm create vergekit@latest my-app -- --install --migrate --no-admin
npm create vergekit@latest my-app -- --no-install
```

Administrator creation remains manual under `--yes` because it securely prompts
for credentials. Non-interactive Node.js + MySQL setup also leaves database
migration and administrator creation manual because its connection prompt is
unavailable. Run `npm create vergekit@latest -- --help` for every CLI option.

## Local Runtime Secrets

The interactive installer creates `.dev.vars` with a fresh Better Auth secret.
If you skipped setup or generated from a non-interactive terminal, copy the
example file:

```bash
cp .dev.vars.example .dev.vars
```

Generate a secret with Node.js:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
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
