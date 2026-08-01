# Authentication Architecture

Verge Kit keeps application policy in the application. `@vergekit/core/auth` supplies shared Better Auth functions.

The integration follows the main parts of the [Better Auth Astro guide](https://better-auth.com/docs/integrations/astro). Verge Kit adds lazy sessions and shared route policy.

## File Ownership

| File | Responsibility |
| --- | --- |
| `src/config/auth.ts` | Route policy, roles, permissions, and auth error text. |
| `src/config/auth-email.ts` | Verification and reset email renderers. |
| `src/config/schema.ts` | Auth tables and plugin fields. |
| `src/pages/api/auth/[...all].ts` | Better Auth HTTP handler and sign-out redirects. |
| `src/middleware.ts` | Lazy session loading and route access. |
| `src/env.d.ts` | Types for runtime values and `Astro.locals`. |
| `src/components/auth/AuthShell.astro` | Shared layout and browser behavior for auth forms. |

The application owns the database, schema, email templates, and policy. The core package creates the Better Auth server configuration.

## Request Flow

Middleware starts each request with anonymous values in `Astro.locals`.

Protected routes load a session before the route runs. Public routes skip this database query unless they request auth state.

Requests to `/api/auth/*` go directly to the Better Auth handler. The handler uses the application database, schema, policy, and email functions.

The handler uses the [Better Auth Drizzle adapter](https://better-auth.com/docs/adapters/drizzle). D1 uses the SQLite provider, and the Node.js preset uses MySQL.

## Auth Locals

Each request receives these typed values:

```ts
Astro.locals.user;
Astro.locals.session;
Astro.locals.isAuthenticated;
Astro.locals.loadAuthSession();
```

`loadAuthSession()` stores one promise for each request. Multiple calls share one session query.

## Configuration Rule

Do not create a separate Better Auth instance in a page or route.

Use `createAuthFromEnv()` at the existing application boundaries. Apply the same plugin and server configuration to each auth construction path.

See the [Configuration Guide](/docs/configuration) for runtime values. See [Route Protection](/docs/auth/routes) for access rules.
