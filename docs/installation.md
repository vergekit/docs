# Installation

## Requirements

- Node.js 22.12 or newer
- npm
- OpenSSL for local secret generation
- A Cloudflare account for remote D1 and Cloudflare deployment

## Recommended Installation

Run the interactive installer:

```bash
npm create vergekit@latest
```

Cloudflare Workers with D1 is the default preset. The installer also offers the [Node.js + MySQL preset](/docs/fieldguide/node-mysql) as a self-hosted alternative.

The installer asks for a project location and completes the guided setup. It creates local secrets, installs dependencies, applies migrations, and can create the initial administrator.

## Manual Installation

If you skip the guided setup or start from the boilerplate files, use these steps. These steps apply to the default Cloudflare Workers with D1 preset.

Run all commands from the generated project directory. Complete only the steps that the installer did not finish.

### Install Dependencies

```bash
npm install
```

### Create Local Secrets

If `.dev.vars` does not exist, copy the template and write a fresh Better Auth secret:

```bash
cp .dev.vars.example .dev.vars && secret="$(openssl rand -base64 32)" && awk -v secret="$secret" 'BEGIN { done = 0 } /^BETTER_AUTH_SECRET=/ { print "BETTER_AUTH_SECRET=" secret; done = 1; next } { print } END { if (!done) print "BETTER_AUTH_SECRET=" secret }' .dev.vars > .dev.vars.tmp && mv .dev.vars.tmp .dev.vars
```

Do not commit `.dev.vars`. Use the [Configuration Guide](/docs/configuration) for other local values, deployed values, and secrets.

### Prepare the Database

Apply the local D1 migrations:

```bash
npm run db:migrate:local
```

See [Database](/docs/database) for schema changes, remote D1 setup, and Drizzle Studio.

### Create an Administrator

To create the initial administrator, run:

```bash
npm run init:admin
```

This step is optional. See [Roles and Administration](/docs/auth/roles-and-admin) for the default roles and administrator workflow.

### Start Development

```bash
npm run dev
```

## Next Steps

- Use [Authentication](/docs/auth/) for the included sign-in flows.
- Use [Route Protection](/docs/auth/routes) for protected pages and API routes.
- Use [Email](/docs/email) to select and configure an email provider.
- Use the [Development Workflow](/docs/workflow) for project checks and common changes.
- Use [Deployment](/docs/deployment) to prepare and deploy the application.
