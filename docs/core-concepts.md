# Core Concepts

## Use The Platform

Verge Kit prefers the framework and platform tools already in the project.

Use Astro pages, API routes, Actions, middleware, and config before adding a new
local abstraction. Add helpers only when they remove repeated code or protect a
real boundary.

## D1 First

D1 is the supported runtime database.

Use the local `src/db` modules from app code. Do not import `drizzle-orm/d1`
directly in routes, pages, actions, or components.

This keeps future Hyperdrive PostgreSQL or MySQL work isolated to the database
adapter layer. The boilerplate does not ship PostgreSQL or MySQL placeholders;
those targets should be added only when real Hyperdrive adapters are
implemented.

## Config Has A Boundary

Use `src/config` for source-level app defaults and auth policy that app code
imports directly. App identity, default authenticated navigation, protected
routes, app roles, permission values, and banned-session copy belong there.

Use `wrangler.jsonc` as the committed source of truth for non-secret Worker
runtime values. Typical values include `EMAIL_PROVIDER`, `EMAIL_FROM`,
`EMAIL_REPLY_TO`, `BETTER_AUTH_URL`, and `MAILGUN_DOMAIN`.

Use `.dev.vars` for local secret values and local-only overrides. Use Wrangler
secrets for deployed secret values. Do not commit API keys, auth secrets, or
provider credentials in `wrangler.jsonc`.

## Server First

Keep auth, database writes, email, and validation on the server.

Use client JavaScript only where it improves a specific interaction.

## Validate At The Boundary

Use Zod for request bodies, form input, and action input.

Keep validation close to the route or action that receives external data.

## Middleware Owns Auth State

Middleware creates the Better Auth instance, reads the session, and writes:

- `Astro.locals.user`
- `Astro.locals.session`
- `Astro.locals.isAuthenticated`

Pages and routes should read from locals instead of reimplementing session
lookup.

## Routes Are Public By Default

Middleware loads auth state for every request, but route protection is opt-in.
Use `src/config/auth.ts` when pages or API namespaces should be consistently
protected by middleware. Use route-local checks when a page or API handler needs
custom redirect or JSON `401` behavior.

Keep Better Auth endpoints under `/api/auth` public so sign in, sign up,
verification, reset, session, callback, and sign-out requests can reach Better
Auth before a user has a session.

## Roles Are App Policy

The Better Auth admin plugin is installed and configured with `admin`,
`moderator`, `user`, and `banned` roles. App permissions live in
`src/config/auth.ts`, and local checks should use the helpers in
`src/auth/permissions.ts`.

## Email Is A Provider

Auth email is rendered once and sent through a provider.

Local development can use `console`. Workers deployments should use Cloudflare
Email, Resend, Mailgun, or another fetch/binding-based provider.

Use `sendEmail` directly for custom transactional messages. Use
`createAuthEmailSenderFromEnv` for Better Auth verification and reset flows so
auth email templates and `EMAIL_FROM` handling stay centralized.

## Initialization Is Operational

Run migrations before seeding users. `npm run init:admin` creates a verified
Better Auth user directly in D1 through Wrangler, selecting local or remote D1
from `BETTER_AUTH_URL` unless `--local` or `--remote` is passed.

## Keep The Boilerplate Small

Verge Kit does not include uploads, media processing, full admin CRUD screens,
analytics, queues, workflows, or production PostgreSQL/MySQL runtime support yet.

Add those when an application needs them.
