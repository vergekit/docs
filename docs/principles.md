# Principles

## Use Existing Platform Tools

Use Astro pages, API routes, Actions, middleware, and configuration before you add an abstraction.

If a helper removes repeated code or protects a system boundary, add it.

## Use the Database Through the App Client

Each database preset provides a configured Drizzle client in `src/db.ts`. Import this client in application code.

Do not import a Drizzle database driver directly in routes, pages, Actions, or components.

## Keep Configuration in the Correct Place

- Use `src/config` for application defaults, schemas, and authentication policy.
- Use `wrangler.jsonc` for committed Worker values that are not secret.
- Use `.dev.vars` for local secrets and local overrides.
- Use Wrangler secrets for deployed secrets.

Do not put API keys, authentication secrets, or provider credentials in `wrangler.jsonc`.

## Keep Server Operations on the Server

Keep authentication, database writes, email, and input validation on the server.

If an interaction requires client JavaScript, use it.

## Use Input Validation

Use Zod for request bodies, forms, and Action input. Keep each schema close to the route or Action that uses it.

## Load Authentication Only When Needed

Each request starts with an anonymous authentication state in `Astro.locals`. Middleware loads a session for protected, admin, and authentication-aware routes.

Public routes can call `Astro.locals.loadAuthSession()`. The loader performs only one session lookup for each request.

## Protect Routes Explicitly

Routes are public by default. Add shared route rules in `src/config/auth.ts`.

Use a route-local check for a custom redirect or a JSON `401` response. Keep `/api/auth/*` public.

See [Route Protection](/docs/auth/routes) for examples.

## Keep Roles in Application Policy

The default roles are `admin`, `moderator`, `user`, and `banned`. Role permissions are in `src/config/auth.ts`.

Use the permission helpers from `@vergekit/core/auth` for local access rules.

## Send Email Through a Provider

Use `sendEmail` for custom transactional email. Use `createAuthEmailSenderFromEnv` for Better Auth verification and reset email.

Local development can use `console`. Deployed Workers can use Cloudflare Email, Resend, or Mailgun.

## Run Migrations Before Initialization

Run migrations before you create users. `npm run init:admin` creates a verified user with the `admin` role.

## Add Features When the App Needs Them

The starter does not include uploads, media processing, analytics, queues, workflows, or full admin screens.
