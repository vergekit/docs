# Node.js + MySQL

Verge Kit uses Cloudflare Workers and D1 by default, but you can use this preset for a self-hosted Node.js server with MySQL. Perfectly suited for deploy to hosts like [Digital Ocean](https://www.digitalocean.com/), [Laravel Cloud](https://laravel.com/cloud), [Hetzner](https://www.hetzner.com/), etc.

The preset creates a standalone Astro server. It replaces the Cloudflare runtime, D1 schema, migrations, and related tests.

## Main Differences

| Concern | Default | Node.js with MySQL |
| --- | --- | --- |
| Runtime | Cloudflare Workers | Standalone Node.js server |
| Database | D1 with SQLite | MySQL with `mysql2` |
| Local configuration | `.dev.vars` and `wrangler.jsonc` | `.env` |
| Migrations | Wrangler | Drizzle Kit |
| Email | Console, Cloudflare Email, Resend, Mailgun | Console, Resend, Mailgun |
| Deployment | `wrangler deploy` | `npm run start` |

Pages, components, Actions, middleware, and authentication policy stay the same.

## Requirements

- Node.js 22.12 or newer
- npm
- MySQL 8
- A process manager and TLS reverse proxy for production

## Create the Project

Run the installer and select Node.js with MySQL:

```bash
npm create vergekit@latest
```

The installer can create `.env`, install dependencies, collect the MySQL connection values, and apply migrations.

The generated application uses Node.js for every run. It does not select a runtime during startup.

## Create the Database

Create an empty MySQL 8 database and a dedicated application user.

An authorized administrator can use this SQL for local development:

```sql
CREATE DATABASE vergekit CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER 'vergekit'@'127.0.0.1' IDENTIFIED BY 'replace-with-a-strong-password';
GRANT ALL PRIVILEGES ON vergekit.* TO 'vergekit'@'127.0.0.1';
```

Change the allowed host to the application host. When possible, keep the database off the public internet.

## Configure the Environment

Copy the environment template:

```bash
cp .env.example .env
```

Add the local values:

```dotenv
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=vergekit
MYSQL_PASSWORD=replace-with-a-strong-password
MYSQL_DATABASE=vergekit
BETTER_AUTH_SECRET=replace-with-a-long-random-secret
BETTER_AUTH_URL=http://localhost:4321
EMAIL_PROVIDER=console
```

If you need a Better Auth secret, generate one:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

Do not commit `.env`. The application, Drizzle Kit, and administrator command use the same five `MYSQL_*` values.

For production, provide these values through the host, process manager, or secret store. Keep `BETTER_AUTH_SECRET` stable.

Set `BETTER_AUTH_URL` to the exact public HTTPS origin.

## Apply Migrations

Apply the committed migrations:

```bash
npm run db:migrate
```

Create the first verified user with the `admin` role:

```bash
npm run init:admin
```

After a schema change, generate and apply a migration:

```bash
npm run db:generate
npm run db:migrate
```

Commit `migrations/*.sql` and `migrations/meta/` with each schema change.

Open the configured database in Drizzle Studio:

```bash
npm run db:studio
```

## Develop and Run Checks

Start local development:

```bash
npm run dev
```

Run all project checks:

```bash
npm run verify
```

## Configure Email

`EMAIL_PROVIDER=console` writes authentication email to the server log. Treat these logs as sensitive data.

For delivered email, use one of these providers:

- Resend requires `RESEND_API_KEY` and `EMAIL_FROM`.
- Mailgun requires `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`, and `EMAIL_FROM`.
- `EMAIL_REPLY_TO` is optional for both providers.

The Node.js preset does not support the `cloudflare` email provider.

Before launch, do a delivery test for verification and password-reset email.

## Build and Start

Build and start the server:

```bash
npm run build
npm run start
```

`npm run start` runs `dist/server/entry.mjs`. Use a process manager to start it on boot and restart it after a failure.

Keep the application port behind a TLS reverse proxy. Send health checks to `/api/health`.

The proxy must forward the original host and protocol. `BETTER_AUTH_URL` must match the public HTTPS origin.

### Apache .htaccess

If running a node process on a VPS with Apache (ex: whm/cpanel, plesk, etc), remember to set up a reverse proxy with .htaccess

#### Reverse Proxy Setup

Enable `mod_headers`, `mod_proxy`, `mod_proxy_http`, and `mod_rewrite`, then add this `.htaccess` file to the site root:

```apache
DirectoryIndex disabled

RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Forward the public origin to the Node.js application
RequestHeader set X-Forwarded-Host "expr=%{HTTP_HOST}"
RequestHeader set X-Forwarded-Proto "https"
RewriteRule ^(.*)$ http://127.0.0.1:4321/$1 [P,L]
```

Change `4321` if the production server listens on a different local port. Apache must allow `.htaccess` overrides for these directives.

#### Additional Rules

Add any other rules that the deployment needs to the same `.htaccess` file. Put the rewrite rules below before the catch-all proxy `RewriteRule`:

```apache
# Block WordPress Probes
# Drop common CMS probes
RewriteRule ^(wp-admin|wp-login|wp-includes|xmlrpc\.php|wlwmanifest\.xml|\.env) - [F]

# Fast 404s for specific paths
RewriteRule ^media/system/js/core\.js$ - [R=404,L]
RewriteRule ^media/wp-includes/wlwmanifest\.xml$ - [R=404,L]

# Hide .git Directory
RedirectMatch 404 /\.git

# Security Headers
Header set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
Header set X-XSS-Protection "1; mode=block"
Header always append X-Frame-Options SAMEORIGIN
Header set X-Content-Type-Options nosniff

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE image/svg+xml
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/json
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/javascript
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/xml
</IfModule>

# Cache Control
<IfModule mod_expires.c>
  ExpiresActive on
  ExpiresDefault "access plus 1 year"

  # Don't cache HTML
  ExpiresByType text/html "access plus 0 seconds"

  # Don't cache JSON/API responses
  ExpiresByType application/json "access plus 0 seconds"

  # Short cache for favicon
  <Files "favicon.ico">
    ExpiresByType image/x-icon "access plus 1 hour"
  </Files>
</IfModule>

# HTTP/2 Push (Optional)
H2PushResource /css/styles.css
H2PushResource /js/app.js
```

## Backups

Back up the database on a schedule that meets your recovery requirements. Keep backup copies outside the database host.

Before each production migration, make sure that a current backup exists. Do restoration tests with a separate database.

## Deployment Checklist

1. Install the exact dependencies with `npm ci`.
2. Add all five `MYSQL_*` values.
3. Add a stable `BETTER_AUTH_SECRET` and the public `BETTER_AUTH_URL`.
4. Configure Resend or Mailgun for production authentication email.
5. Make sure that a current database backup exists.
6. Run `npm run db:migrate`.
7. Run `npm run verify`.
8. Run `npm run build`.
9. Start `npm run start` with a process manager and reverse proxy.
10. Do checks for `/api/health`, authentication, protected routes, and administrator access.
11. Monitor the process, logs, database, and backups.
