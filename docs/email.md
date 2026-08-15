# Email

Verge Kit sends transactional email through `@vergekit/core/email`. React Email templates live in `src/email`.

Available providers are `console`, Cloudflare Email, Resend, and Mailgun. Use `console` for local development without delivery.

## Send transactional email

Use `sendEmail` in Worker or Astro server code:

```ts
import { env } from 'cloudflare:workers';
import { sendEmail } from '@vergekit/core/email';

try {
  const result = await sendEmail(env, {
    to: { email: 'customer@example.com', name: 'Customer Name' },
    from: { email: 'noreply@example.com', name: 'VK' },
    subject: 'Your VK receipt',
    html: '<p>Thanks for your order.</p>',
    text: 'Thanks for your order.',
    replyTo: 'support@example.com',
  });

  console.info('sent email', result.provider, result.id);
} catch (error) {
  console.error('Email send failed', error);
}
```

- `to` accepts one address, one named address, or an array of addresses.
- Include both `html` and `text` content.
- Include `from` for direct sends. `sendEmail` does not read `EMAIL_FROM` automatically.
- Catch provider errors at the route or job boundary. Do not return provider response bodies to users.

## Configure a provider

`EMAIL_PROVIDER` selects the provider. If this value is missing, Verge Kit uses `console`.

| Provider | Required configuration |
| --- | --- |
| `console` | None (writes message to server log) |
| `cloudflare` | An `EMAIL` binding and an onboarded sending domain |
| `resend` | `RESEND_API_KEY` |
| `mailgun` | `MAILGUN_API_KEY` plus `MAILGUN_DOMAIN` in `wrangler.jsonc` |

Put non-secret values in `wrangler.jsonc`:

```jsonc
{
  "vars": {
    "EMAIL_PROVIDER": "resend",
    "EMAIL_FROM": "VK <noreply@example.com>",
    "EMAIL_REPLY_TO": "support@example.com",
  },
}
```

For Cloudflare Email, add the binding to `wrangler.jsonc`:

```jsonc
{
  "send_email": [{ "name": "EMAIL" }]
}
```

See the [Cloudflare Email setup guide](https://developers.cloudflare.com/email-service/get-started/send-emails/) for domain onboarding.

Store local provider secrets in `.dev.vars`:

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

## React Email templates

Templates use [React Email](https://react.email/) components and render to HTML and plain text. The starter includes these authentication templates:

- `src/email/auth/verify-email.tsx`
- `src/email/auth/reset-password.tsx`

Configure their sender defaults and render functions in `src/config/auth-email.ts`. Better Auth uses this configuration for verification and password-reset email.

Add custom `.tsx` templates under `src/email`. Render each template to HTML and plain text before you pass it to `sendEmail`.

Preview all templates locally:

```bash
npm run email
```

See the [React Email documentation](https://react.email/docs/introduction) for components and custom templates.
