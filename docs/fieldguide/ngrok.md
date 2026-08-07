# Ngrok

The default ngrok workflow (running with parallel CLI command) doesn't always work with Vite. This guide helps to expose your local dev server with [vite-plugin-ngrok](https://github.com/aphex/vite-plugin-ngrok).

## Installation

```bash
npm i -D vite-plugin-ngrok
```

## Configuration

Add to `astro.config.mjs`:

```javascript
import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { ngrok } from 'vite-plugin-ngrok';

const devVars = parseEnv(
  readFileSync(new URL('./.dev.vars', import.meta.url), 'utf8'),
);

export default defineConfig({
  vite: {
    plugins: [
      ngrok({
        domain: devVars.NGROK_DOMAIN,
        compression: true,
        authtoken: devVars.NGROK_AUTHTOKEN,
      }),
    ],
  },
});
```

Add the local values to `.dev.vars`:

```dotenv
NGROK_DOMAIN=your-domain.ngrok.app
NGROK_AUTHTOKEN=your-auth-token
```

Astro evaluates `astro.config.mjs` before it loads environment files. Wrangler
also loads `.dev.vars` for the Worker runtime after this configuration step.
The `parseEnv` call reads the same file when Astro evaluates the configuration.

## Use Cases

- Testing OAuth callbacks locally
- Sharing work-in-progress with clients
- Testing webhooks from external services
- Mobile device testing
