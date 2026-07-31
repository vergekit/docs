# Route Authentication

Routes are public by default. Use one of these methods to require authentication:

- Add a route rule to `src/config/auth.ts` for access that applies across the app.
- Add a route-local check for access that is specific to one page or API route.

## Protect Routes in Middleware

Add one page to `protectedExactPaths`:

```ts
export const authConfig = defineAuthConfig({
  routes: {
    protectedExactPaths: ['/dashboard', '/account'],
    protectedPrefixes: [],
    // ...
  },
  // ...
});
```

Add a route group to `protectedPrefixes`:

```ts
export const authConfig = defineAuthConfig({
  routes: {
    protectedExactPaths: ['/dashboard'],
    protectedPrefixes: ['/settings/', '/api/account/'],
    // ...
  },
  // ...
});
```

End each prefix with a slash. The prefix `/settings/` matches `/settings/profile`, but it does not match `/settings-public`.

A prefix does not protect its index route. If the index route requires authentication, add `/settings` to `protectedExactPaths`.

Astro route-group names do not appear in URLs. For `src/pages/(app)/dashboard.astro`, add `/dashboard` to `protectedExactPaths`.

An unauthenticated request redirects to `/login`. The redirect URL includes the original destination:

```text
/login?redirectTo=%2Fdashboard
```

## Protect Admin Routes

Admin routes require authentication and the `app:administer` permission:

```ts
export const authConfig = defineAuthConfig({
  routes: {
    adminExactPaths: ['/admin'],
    adminPrefixes: ['/admin/'],
    adminPermission: { app: ['administer'] },
    // ...
  },
  // ...
});
```

Unauthenticated users go to `/login`. Authenticated users without permission receive a `403` response.

Set role permissions in `src/config/auth.ts`:

```ts
export const authConfig = defineAuthConfig({
  roles: {
    roleAppPermissions: {
      admin: ['access', 'moderate', 'administer'],
      moderator: ['access', 'moderate'],
      user: ['access'],
      banned: [],
    },
    // ...
  },
  // ...
});
```

## Add a Route-Local Check

If a route needs custom access or a custom response, use a local check. Public routes must load the session before they read it.

For an Astro page, load the session and redirect from the frontmatter:

```astro
---
const destination = `${Astro.url.pathname}${Astro.url.search}`;

await Astro.locals.loadAuthSession();

if (!Astro.locals.isAuthenticated) {
  return Astro.redirect(
    `/login?redirectTo=${encodeURIComponent(destination)}`,
  );
}
---
```

For an API route, return a `401` response:

```ts
import type { APIRoute } from 'astro';
import { jsonFailure, jsonSuccess } from '@vergekit/core/http';

export const POST: APIRoute = async ({ locals }) => {
  await locals.loadAuthSession();

  if (!locals.isAuthenticated) {
    return jsonFailure('Unauthorized', { status: 401 });
  }

  return jsonSuccess({ ok: true });
};
```

For a permission check, use `userHasAppPermission`:

```ts
import { userHasAppPermission } from '@vergekit/core/auth';
import { authConfig } from '@/config/auth';

if (!userHasAppPermission(authConfig, locals.user, { app: ['moderate'] })) {
  return new Response('Forbidden', { status: 403 });
}
```

## Keep Authentication Endpoints Public

Keep `/api/auth/*` public. Sign-in, sign-up, session, callback, verification, reset, and sign-out requests use these endpoints before authentication.

## Run Tests

After you change middleware rules, run the authentication and middleware tests:

```bash
npm run test -- tests/auth tests/middleware
```

For a route-local check, test the route handler. Provide a `locals.loadAuthSession` implementation that sets the required authentication state.
