# Installation

## Requirements

- Node.js 22.12 or newer
- npm
- A Cloudflare account for remote D1 and deployment

## Create a Project

Run the installer:

```bash
npm create vergekit@latest
```

The installer asks for a project location and a runtime. Cloudflare Workers with D1 is the default runtime.

You can include the project location in the command:

```bash
npm create vergekit@latest my-app
```

The guided D1 setup can complete these tasks:

- Install dependencies.
- Create `.dev.vars` with a new Better Auth secret.
- Apply local migrations.
- Start administrator creation.

The [Node.js + MySQL preset](/docs/presets/node-mysql) uses `.env` and asks for the database connection.

For scripts and CI, use setup flags:

```bash
npm create vergekit@latest my-app -- --yes
npm create vergekit@latest my-app -- --install --migrate --no-admin
npm create vergekit@latest my-app -- --no-install
```

`--yes` installs dependencies and applies local D1 migrations. Administrator creation always requires an interactive terminal.

Run this command to see all installer flags:

```bash
npm create vergekit@latest -- --help
```

## Add Local Secrets

If the installer did not create `.dev.vars`, copy the example file:

```bash
cp .dev.vars.example .dev.vars
```

Generate a Better Auth secret:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

Add the secret and the local URL to `.dev.vars`:

```bash
BETTER_AUTH_SECRET=your-generated-secret
BETTER_AUTH_URL=http://localhost:4321
```

Do not commit `.dev.vars`.

## Prepare the Database

Apply the local D1 migrations:

```bash
npm run db:migrate:local
```

Create a local user with the `admin` role:

```bash
npm run init:admin
```

This command writes directly to D1. The development server does not need to run.

See [D1 Setup](/docs/database) for schema changes, remote databases, and Drizzle Studio.

## Configure Routes and Email

See [Authentication](/docs/auth/) for the included flows and required configuration.

Routes are public by default. See [Route Protection](/docs/auth/routes) to protect a page or API route.

Local email uses the `console` provider by default. It writes authentication links to the terminal.

See [Email](/docs/email) to configure Cloudflare Email, Resend, or Mailgun.

See the [Configuration Guide](/docs/configuration) for the location of application values and secrets.

## Run the Project

Start the development server:

```bash
npm run dev
```

Run all project checks:

```bash
npm run verify
```

`npm run verify` runs type checks, linting, tests, and the production build.
