# Authentication

Verge Kit includes email and password authentication through Better Auth. The starter supplies the database schema, pages, middleware, and email templates.

## Included Features

- Registration with a name, email address, and password.
- Email verification before the first sign-in.
- Automatic sign-in after email verification.
- Sign-in and sign-out.
- Password reset by email.
- Database-backed sessions in D1 or MySQL.
- Roles, permissions, bans, and Better Auth admin functions.

Better Auth stores a session token in a cookie. Verge Kit does not enable the Better Auth JWT plugin.

Read the Better Auth guides for [email and password](https://better-auth.com/docs/authentication/email-password), [email](https://better-auth.com/docs/concepts/email), and [sessions](https://better-auth.com/docs/concepts/session-management).

## Required Configuration

The included authentication flow does not require application code changes.

1. Add `BETTER_AUTH_SECRET` to the local environment.
2. Apply the database migrations.
3. Configure an email provider for delivered email.
4. Add `BETTER_AUTH_URL` for a stable production origin.

The installer can create the local secret and apply local migrations. See [Installation](/docs/installation) for the commands.

The `console` email provider prints verification and reset messages during local development. See [Email](/docs/email) for production providers.

Run `npm run init:admin` to create a verified administrator. This step is optional.

## Included Pages

| Path | Purpose |
| --- | --- |
| `/register` | Create an account. |
| `/login` | Start a session. |
| `/auth/check-email` | Tell the user to read the verification email. |
| `/auth/verify-email` | Send a new verification email. |
| `/auth/forgot-password` | Request a password-reset email. |
| `/auth/reset-password` | Set a new password from a reset link. |
| `/dashboard` | Show the starter page for signed-in users. |

The catch-all route at `/api/auth/*` supplies the Better Auth endpoints. Keep this route public.

## Features Not Included

The starter does not include social sign-in, passkeys, magic links, multi-factor authentication, or an admin user interface.

Use [Better Auth plugins](https://better-auth.com/docs/plugins) to add authentication features. See [Plugins](/docs/auth/plugins) before you change the configuration.

## Next Pages

- [Architecture](/docs/auth/architecture) explains the request flow and file ownership.
- [Route Protection](/docs/auth/routes) explains authentication and permission rules for routes.
- [Data Authorization and Ownership](/docs/auth/data-authorization) explains access rules for individual records.
- [Auth Forms](/docs/auth/forms) explains the form attributes in the included pages.
- [Roles and Admin](/docs/auth/roles-and-admin) explains the default access policy.
- [Schema and Migrations](/docs/auth/schema-and-migrations) explains database changes for authentication.
