# Auth Forms

The included auth pages send JSON requests to the Better Auth API. The pages do not create a Better Auth client.

Read the Better Auth [basic usage](https://better-auth.com/docs/basic-usage) and [email and password](https://better-auth.com/docs/authentication/email-password) guides for endpoint behavior.

## Form Behavior

`src/components/auth/AuthShell.astro` calls `mountAuthForms()` from `@vergekit/core/auth`.

The function finds each form with `data-auth-form`. It sends the form data as JSON and shows API errors in the page.

The function disables the submit button during the request. After success, it accepts only a same-origin redirect.

## Form Attributes

| Attribute | Purpose |
| --- | --- |
| `data-auth-form` | Adds the shared submit behavior. |
| `data-auth-error` | Gives the ID of the element that shows errors. |
| `data-auth-success-url` | Sets a local redirect after success. |
| `callbackURL` | Gives Better Auth the redirect after sign-in or verification. |
| `redirectTo` | Gives the password-reset or sign-out destination. |

If you change an included auth form, keep these attributes.

## Included Endpoints

| Form | Endpoint |
| --- | --- |
| Registration | `/api/auth/sign-up/email` |
| Sign-in | `/api/auth/sign-in/email` |
| Verification email | `/api/auth/send-verification-email` |
| Password-reset request | `/api/auth/request-password-reset` |
| New password | `/api/auth/reset-password` |
| Sign-out | `/api/auth/sign-out` |

The [Better Auth email guide](https://better-auth.com/docs/concepts/email) explains verification and password-reset behavior. Verge Kit sends these messages through its email provider.

## Sign-Out Forms

The authenticated layout uses a standard HTML form for sign-out. JavaScript is not required.

For an HTML form request, the auth handler returns a `303` redirect. It also keeps every session cookie from Better Auth.

For a JSON request, the handler returns the original Better Auth response.

## Add Client Functions

If a feature requires client functions, create a Better Auth client. See [Plugins](/auth/plugins) for the shared plugin configuration.
