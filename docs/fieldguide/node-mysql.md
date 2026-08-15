# Node.js + MySQL

Use this preset to run Verge Kit as a standalone Node.js server with MySQL. It replaces Cloudflare Workers, D1, and Wrangler migrations.

Pages, components, Actions, middleware, and authentication policy stay the same.

| Concern | Default preset | Node.js + MySQL preset |
| --- | --- | --- |
| Runtime | Cloudflare Workers | Standalone Node.js server |
| Database | D1 with SQLite | MySQL with `mysql2` |
| Local environment | `.dev.vars` | `.env` |
| Migrations | Wrangler | Drizzle Kit |
| Production | `wrangler deploy` | Persistent `npm run start` process |

## Requirements

- MySQL 8
- A process manager such as PM2 and a TLS reverse proxy for production

## Configuring MySQL

Create a local MySQL 8 database and a dedicated application user. 

An authorized administrator can use this SQL for local development:

```sql
CREATE DATABASE vergekit CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER 'vergekit'@'127.0.0.1' IDENTIFIED BY 'replace-with-a-strong-password';
GRANT ALL PRIVILEGES ON vergekit.* TO 'vergekit'@'127.0.0.1';
```

If the installer did not create `.env`, copy the environment template:

```bash
cp .env.example .env
```

And add the credentials for your local database to `.env`

The Node.js preset also reads Better Auth and email values from `.env`. The included `.env.example` lists every supported value.

Do not commit `.env`. In production, provide these values through the host, process manager, or secret store.

## Managing the database

The Node.js preset has one MySQL migration target. Its command does not use the D1 `:local` or `:remote` suffixes.

```bash
npm run db:migrate
```

Read the Drizzle guide for [migration workflows](https://orm.drizzle.team/docs/migrations).

## Email providers

The Node.js preset supports console output, Resend, and Mailgun. Cloudflare Email requires a Worker binding, however, so it is not supported with this configuration.

Put the selected provider and its values in `.env` or the production environment. See [Email](/email) for provider values and templates.

## Running in production

Unlike the Worker preset, the Node.js preset runs as a persistent server process. After the [production build](/overview#command-scripts), start the server:

```bash
npm run start
```

`npm run start` runs `dist/server/entry.mjs`.

In production:

- Use PM2 or another process manager to restart the server after a failure.
- Keep the application port private behind a TLS reverse proxy.
- Forward the original host and protocol.
- Send health checks to `/api/health`.

### PM2

On a VPS, use [PM2](https://pm2.keymetrics.io/docs/usage/quick-start/) to keep the Node.js process online:

```bash
npm install --global pm2
pm2 start npm --name vergekit -- start
```

Run `pm2 startup`, then run the system command that PM2 prints. Run `pm2 save` to restore the process after a reboot.

Read the PM2 guide for [startup scripts](https://pm2.keymetrics.io/docs/usage/startup/).

### Apache `.htaccess`

Enable `mod_headers`, `mod_proxy`, `mod_proxy_http`, and `mod_rewrite`. Add this file to the site root:

```apache
DirectoryIndex disabled

RewriteEngine On

RequestHeader set X-Forwarded-Host "expr=%{HTTP_HOST}"
RequestHeader set X-Forwarded-Proto "https"
RewriteRule ^(.*)$ http://127.0.0.1:4321/$1 [P,L]
```

If the server uses a different local port, change `4321`. Apache must allow these directives in `.htaccess`.

For virtual-host configuration and other proxy options, read the [Apache reverse proxy guide](https://httpd.apache.org/docs/current/en/howto/reverse_proxy.html).

## Back up MySQL

Remember to keep scheduled backup copies outside the database host! Test restoration with a separate database.

Make sure that a current backup exists before each production migration.
