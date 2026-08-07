# Email

Verge Kit sends email through `@vergekit/core/email`. Application templates are in `src/email`.

Available providers are `console`, Cloudflare Email, Resend, and Mailgun. Use `console` for local development without delivery.

## Send Transactional Email

Use `sendEmail` in Worker or Astro server code:

```ts
import { env } from 'cloudflare:workers';
import { sendEmail } from '@vergekit/core/email';

const result = await sendEmail(env, {
  to: { email: 'customer@example.com', name: 'Customer Name' },
  from: { email: 'noreply@example.com', name: 'VK' },
  subject: 'Your VK receipt',
  html: '<p>Thanks for your order.</p>',
  text: 'Thanks for your order.',
  replyTo: 'support@example.com',
});

console.info('sent email', result.provider, result.id);
```

`to` accepts one address, one named address, or an array of either form. `from` and `replyTo` accept the same forms.

Always include `html` and `text`. The text value gives each message a plain-text version.

For a direct send, include `from` in the message. `sendEmail` does not read `EMAIL_FROM` automatically.

## Configure a Provider

`EMAIL_PROVIDER` selects the provider. If this value is missing, Verge Kit uses `console`.

| Provider | Required configuration |
| --- | --- |
| `console` | None (writes message to server log) |
| `cloudflare` | An `EMAIL` binding in `wrangler.jsonc` |
| `resend` | `RESEND_API_KEY` |
| `mailgun` | `MAILGUN_API_KEY` and `MAILGUN_DOMAIN` |

Put non-secret values in `wrangler.jsonc`:

```jsonc
{
  "vars": {
    "EMAIL_PROVIDER": "resend",
    "EMAIL_FROM": "VK <noreply@example.com>",
    "EMAIL_REPLY_TO": "support@example.com",
    "MAILGUN_DOMAIN": "mg.example.com",
  },
}
```

Put local secrets in `.dev.vars`:

```bash
RESEND_API_KEY=your-local-resend-key
MAILGUN_API_KEY=your-local-mailgun-key
```

Use Wrangler for deployed secrets:

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put MAILGUN_API_KEY
```

Add only the secret for the selected provider.

## Send Authentication Email

Use `createAuthEmailSenderFromEnv` for verification and password-reset email:

```ts
import { env } from 'cloudflare:workers';
import { createAuthEmailSenderFromEnv } from '@vergekit/core/email';
import { authEmailOptions } from '@/config/auth-email';

const authEmail = createAuthEmailSenderFromEnv(env, authEmailOptions);

await authEmail.sendVerificationEmail({
  to: 'customer@example.com',
  name: 'Customer Name',
  url: 'https://example.com/auth/verify?token=...',
});
```

Configure sender defaults and render functions in `src/config/auth-email.ts`. The email templates are in these files:

- `src/email/auth/verify-email.tsx`
- `src/email/auth/reset-password.tsx`

Preview the templates:

```bash
npm run email
```

The route `src/pages/api/debug/email.ts` does not send email by default. Enable its example implementation to do a manual delivery test.

## Handle Errors

A missing configuration value or provider error causes `sendEmail` to reject. Catch the error at the route or job boundary.

```ts
try {
  await sendEmail(env, message);
} catch (error) {
  console.error('Email send failed', error);
}
```

Do not return provider response bodies to users. If you need diagnostic data, store the optional result `id`.

## Test Email Code

Use the `console` provider for a test that does not need delivery:

```ts
const info = vi.fn();

const result = await sendEmail(
  { EMAIL_PROVIDER: 'console' },
  {
    to: 'customer@example.com',
    from: 'noreply@example.test',
    subject: 'Test email',
    html: '<p>Hello</p>',
    text: 'Hello',
  },
  { console: { info } },
);

expect(result).toEqual({ provider: 'console', id: 'console' });
expect(info).toHaveBeenCalledWith('[email:console]', expect.any(Object));
```

For Resend or Mailgun tests, pass `options.fetcher` to replace HTTP requests.
