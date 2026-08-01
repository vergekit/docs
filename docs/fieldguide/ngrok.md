# Ngrok

Expose your local dev server with [vite-plugin-ngrok](https://github.com/aphex/vite-plugin-ngrok).

## Installation

```bash
npm i -D vite-plugin-ngrok
```

## Configuration

Add to `astro.config.mjs`:

```javascript
import { ngrok } from "vite-plugin-ngrok";

export default defineConfig({
  vite: {
    plugins: [
      ngrok({
        domain: import.meta.env.VITE_NGROK_DOMAIN,
        compression: true,
        authtoken: import.meta.env.VITE_NGROK_AUTH_TOKEN,
      }),
    ],
  },
});
```

Add to `.env`:

```
VITE_NGROK_DOMAIN="your-domain.ngrok.io"
VITE_NGROK_AUTH_TOKEN="your-auth-token"
```

## Use Cases

- Testing OAuth callbacks locally
- Sharing work-in-progress with clients
- Testing webhooks from external services
- Mobile device testing
