# Apache .htaccess

Apache configuration snippets for VPS deployment with cPanel/WHM.

## Reverse Proxy Setup

Basic reverse proxy to your Node.js app:

```apache
DirectoryIndex disabled

RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Proxy to Node app
RequestHeader set X-Forwarded-Host "%{HTTP_HOST}e"
RewriteRule ^/?(.*)$ http://localhost:6969/$1 [P,L]
```

## Block WordPress Probes

Block automated scans looking for WordPress vulnerabilities:

```apache
# Drop common CMS probes
RewriteRule ^(wp-admin|wp-login|wp-includes|xmlrpc\.php|wlwmanifest\.xml|\.env) - [F]

# Fast 404s for specific paths
RewriteRule ^media/system/js/core\.js$ - [R=404,L]
RewriteRule ^media/wp-includes/wlwmanifest\.xml$ - [R=404,L]
```

## Hide .git Directory

```apache
RedirectMatch 404 /\.git
```

## Security Headers

```apache
Header set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
Header set X-XSS-Protection "1; mode=block"
Header always append X-Frame-Options SAMEORIGIN
Header set X-Content-Type-Options nosniff
```

## Compression

Enable gzip compression for text-based assets:

```apache
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
```

## Cache Control

Set cache headers for static assets:

```apache
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
```

## HTTP/2 Push (Optional)

Pre-push critical resources:

```apache
H2PushResource /css/styles.css
H2PushResource /js/app.js
```
