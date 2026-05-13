# 🚀 Complete Render Deployment Guide for Laravel + Inertia.js + React

**For: ALMKA_Blind Project**

---

## 📋 TABLE OF CONTENTS

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Render Account Setup](#render-account-setup)
4. [Environment Variables](#environment-variables)
5. [Database Setup on Render](#database-setup-on-render)
6. [Configuration Files](#configuration-files)
7. [Laravel Production Setup](#laravel-production-setup)
8. [Vite Configuration](#vite-configuration)
9. [React/Inertia Configuration](#reactinertia-configuration)
10. [Build and Start Commands](#build-and-start-commands)
11. [GitHub Integration](#github-integration)
12. [Complete Step-by-Step Deployment](#complete-step-by-step-deployment)
13. [Running Migrations on Render](#running-migrations-on-render)
14. [Troubleshooting](#troubleshooting)
15. [Common Mistakes](#common-mistakes)
16. [After Deployment](#after-deployment)

---

## PREREQUISITES

Before you start, make sure you have:

- ✅ Laravel project in GitHub repository: https://github.com/alonzoaljon-dev/almka-blind
- ✅ All code committed and pushed to GitHub `main` branch
- ✅ Render.com account (free tier available)
- ✅ GitHub account with repository access
- ✅ Local project working on XAMPP (http://localhost:8000)

---

## PROJECT STRUCTURE

Your project should have this structure:

```
almka-blind/
├── app/                    # Laravel application code
├── bootstrap/
├── config/
├── database/
│   ├── migrations/        # Database migration files
│   ├── seeders/
├── public/
│   ├── index.php          # Entry point
│   ├── build/             # Built Vite assets (NOT in git)
├── resources/
│   ├── css/
│   ├── js/
│   │   ├── Pages/         # React pages
│   │   └── Components/    # React components
│   └── views/
│       └── app.blade.php  # Inertia root template
├── routes/
│   ├── api.php
│   ├── web.php
├── storage/               # For file uploads (NOT in git)
├── vendor/                # Composer packages (NOT in git)
├── node_modules/          # npm packages (NOT in git)
├── .env                   # Local only (NOT in git)
├── .env.example           # Template (YES in git)
├── .gitignore
├── composer.json
├── package.json
├── vite.config.js
├── tailwind.config.js
├── render.yaml            # Render configuration (YES in git)
└── README.md
```

**Important Files for Render:**
- ✅ `render.yaml` - Deployment configuration
- ✅ `.env.example` - Environment variables template
- ✅ `composer.json` - PHP dependencies
- ✅ `package.json` - Node.js dependencies
- ✅ `vite.config.js` - Build configuration

---

## RENDER ACCOUNT SETUP

### Step 1: Create Render Account

1. Go to https://render.com
2. Click **"Sign Up"**
3. Choose **"Sign up with GitHub"**
4. Authorize Render to access your GitHub account
5. Click **"Continue"**

### Step 2: Connect GitHub Repository

1. After signing in, click **"+ New"** in top right
2. Select **"Web Service"**
3. Click **"Connect a Repository"**
4. Find and select **"almka-blind"**
5. Click **"Connect"**

---

## ENVIRONMENT VARIABLES

### Step 1: Create `.env.example`

Add this file to your project root (COMMIT TO GITHUB):

```bash
APP_NAME=ALMKA
APP_ENV=production
APP_DEBUG=false
APP_KEY=
APP_URL=

LOG_CHANNEL=stack
LOG_LEVEL=debug

DB_CONNECTION=pgsql
DB_HOST=
DB_PORT=5432
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

CACHE_STORE=database
QUEUE_CONNECTION=database
SESSION_DRIVER=database
FILESYSTEM_DISK=local

VITE_API_BASE_URL=/api
```

### Step 2: Add Variables to Render Dashboard

In Render Web Service dashboard, go to **"Environment"** tab.

Click **"Add Environment Variable"** for each:

```
APP_NAME=ALMKA
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_URL=https://almka-blind.onrender.com
LOG_CHANNEL=stack
LOG_LEVEL=debug
DB_CONNECTION=pgsql
DB_HOST=YOUR_DATABASE_HOST
DB_PORT=5432
DB_DATABASE=YOUR_DATABASE_NAME
DB_USERNAME=YOUR_DATABASE_USER
DB_PASSWORD=YOUR_DATABASE_PASSWORD
CACHE_STORE=database
QUEUE_CONNECTION=database
SESSION_DRIVER=database
FILESYSTEM_DISK=local
VITE_API_BASE_URL=/api
```

**⚠️ How to get values:**
- `APP_KEY`: We'll generate this later with `php artisan key:generate`
- `APP_URL`: Render will give you URL after creating the service
- Database values: We'll create PostgreSQL database next

---

## DATABASE SETUP ON RENDER

### Step 1: Create PostgreSQL Database

1. In Render dashboard, click **"+ New"**
2. Select **"PostgreSQL"**
3. Fill in:
   - **Name:** `almka-blind-db`
   - **Database:** `almka_blind`
   - **User:** `almka_user`
   - **Region:** Choose closest to you
   - **PostgreSQL Version:** 15
   - **Plan:** Free tier
4. Click **"Create Database"**

### Step 2: Get Database Credentials

Once created, Render shows:
- Internal Database URL
- External Database URL
- Hostname
- Port
- Username
- Password
- Database name

**Copy these values to your Render Web Service environment variables:**

```
DB_HOST=your-db-host.render.com
DB_PORT=5432
DB_DATABASE=almka_blind
DB_USERNAME=almka_user
DB_PASSWORD=your-password
```

---

## CONFIGURATION FILES

### File 1: `render.yaml` (Create in project root)

Add and COMMIT to GitHub:

```yaml
services:
  - type: web
    name: almka-blind
    env: php
    plan: free
    buildCommand: composer install --no-dev && npm install && npm run build
    startCommand: php artisan migrate --force && php artisan serve --host 0.0.0.0 --port $PORT
    envVars:
      - key: APP_NAME
        value: ALMKA
      - key: APP_ENV
        value: production
      - key: APP_DEBUG
        value: false
      - key: APP_KEY
        scope: web
      - key: APP_URL
        scope: web
      - key: DB_CONNECTION
        value: pgsql
```

### File 2: `composer.json` (Update)

Make sure these are in your `composer.json`:

```json
{
  "require": {
    "php": "^8.1",
    "laravel/framework": "^12.0",
    "laravel/tinker": "^2.9",
    "inertiajs/inertia-laravel": "^0.6"
  },
  "require-dev": {
    "fakerphp/faker": "^1.23",
    "laravel/pint": "^1.13",
    "laravel/sail": "^1.26",
    "mockery/mockery": "^1.6",
    "phpunit/phpunit": "^11.0"
  },
  "scripts": {
    "post-autoload-dump": [
      "Illuminate\\Foundation\\ComposerScripts::postAutoloadDump",
      "@php artisan package:discover --ansi"
    ]
  }
}
```

### File 3: `package.json` (Check these exist)

```json
{
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "@inertiajs/react": "^1.0",
    "@vitejs/plugin-react": "^4.0",
    "react": "^18.0",
    "react-dom": "^18.0",
    "tailwindcss": "^3.0",
    "vite": "^5.0"
  }
}
```

---

## LARAVEL PRODUCTION SETUP

### Step 1: Update `config/app.php`

Make sure these settings exist:

```php
return [
    'name' => env('APP_NAME', 'ALMKA'),
    'env' => env('APP_ENV', 'production'),
    'debug' => env('APP_DEBUG', false),  // ⚠️ Must be FALSE in production
    'url' => env('APP_URL', 'http://localhost'),
    'asset_url' => env('ASSET_URL'),
    // ... rest of config
];
```

### Step 2: Update `config/database.php`

Make sure PostgreSQL is configured:

```php
'pgsql' => [
    'driver' => 'pgsql',
    'url' => env('DATABASE_URL'),
    'host' => env('DB_HOST', 'localhost'),
    'port' => env('DB_PORT', '5432'),
    'database' => env('DB_DATABASE', 'forge'),
    'username' => env('DB_USERNAME', 'forge'),
    'password' => env('DB_PASSWORD', ''),
    'charset' => 'utf8',
    'prefix' => '',
    'prefix_indexes' => true,
    'schema' => 'public',
    'sslmode' => 'require',
],
```

### Step 3: Update `.env` (Local only, NOT committed)

```env
APP_NAME=ALMKA
APP_ENV=local
APP_DEBUG=true
APP_KEY=base64:B8H9LQlwTpEdg0RwG7/qLX96pVQoYGC0qd64vGuuPPg=
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=almka_blind
DB_USERNAME=root
DB_PASSWORD=

CACHE_STORE=database
SESSION_DRIVER=database
QUEUE_CONNECTION=database
```

### Step 4: Optimize for Production (Run Locally)

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Then commit these cached files.

---

## VITE CONFIGURATION

### Update `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import laravel from 'laravel-vite-plugin'

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    build: {
        outDir: 'public/build',
        manifest: true,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
            },
        },
    },
    server: {
        hmr: {
            host: 'localhost',
            port: 5173,
        },
    },
})
```

---

## REACT/INERTIA CONFIGURATION

### Update `resources/views/app.blade.php`

```blade
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title inertia>{{ config('app.name', 'ALMKA') }}</title>
    @vite('resources/js/app.jsx')
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
```

### Update `resources/js/app.jsx`

```javascript
import './bootstrap'
import '../css/app.css'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'

createInertiaApp({
    resolve: (name) => resolvePageComponent(name, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />)
    },
})
```

### Create `resources/js/bootstrap.js`

```javascript
import axios from 'axios'

window.axios = axios
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
window.axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
```

---

## BUILD AND START COMMANDS

### Build Command (Runs on Render during deployment)

```bash
composer install --no-dev && npm install && npm run build
```

**What this does:**
1. `composer install --no-dev` - Install PHP packages (skip dev packages)
2. `npm install` - Install Node packages
3. `npm run build` - Build React/Vite assets

### Start Command (Runs on Render after deployment)

```bash
php artisan migrate --force && php artisan serve --host 0.0.0.0 --port $PORT
```

**What this does:**
1. `php artisan migrate --force` - Run database migrations automatically
2. `php artisan serve --host 0.0.0.0 --port $PORT` - Start Laravel server

---

## GITHUB INTEGRATION

### Step 1: Push Code to GitHub

Make sure all files are committed:

```bash
git add .
git commit -m "Deploy: Render configuration and production setup"
git push origin main
```

### Step 2: Connect Render to GitHub

In Render dashboard:

1. Go to Web Service settings
2. Click **"Settings"** tab
3. Find **"Deploy hook"** section
4. Copy the URL
5. Go to GitHub repository settings
6. Click **"Webhooks"** → **"Add webhook"**
7. Paste the Render URL
8. Set content type to **"application/json"**
9. Click **"Add webhook"**

Now every git push automatically deploys to Render! ✨

---

## COMPLETE STEP-BY-STEP DEPLOYMENT

### ✅ STEP 1: Prepare Local Project

On your Windows machine in VS Code terminal:

```bash
cd C:\xampp\htdocs\ALMKA_Blind

# Make sure all code is clean
git status

# If there are changes, commit them
git add .
git commit -m "Pre-deployment commit"
git push origin main
```

### ✅ STEP 2: Create `.env.example`

Create file `C:\xampp\htdocs\ALMKA_Blind\.env.example` with:

```bash
APP_NAME=ALMKA
APP_ENV=production
APP_DEBUG=false
APP_KEY=
APP_URL=

LOG_CHANNEL=stack

DB_CONNECTION=pgsql
DB_HOST=
DB_PORT=5432
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

CACHE_STORE=database
QUEUE_CONNECTION=database
SESSION_DRIVER=database
FILESYSTEM_DISK=local
```

Commit it:

```bash
git add .env.example
git commit -m "Add environment template"
git push origin main
```

### ✅ STEP 3: Create `render.yaml`

Create file `C:\xampp\htdocs\ALMKA_Blind\render.yaml` with content from "Configuration Files" section above.

Commit it:

```bash
git add render.yaml
git commit -m "Add Render deployment configuration"
git push origin main
```

### ✅ STEP 4: Optimize Laravel for Production

```bash
cd C:\xampp\htdocs\ALMKA_Blind

# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Build frontend
npm run build
```

Then commit:

```bash
git add .
git commit -m "Production optimization and build"
git push origin main
```

### ✅ STEP 5: Go to Render Dashboard

1. Visit https://render.com/dashboard
2. Click **"+ New"**
3. Click **"Web Service"**
4. Click **"Connect a Repository"**
5. Find and select **"almka-blind"**
6. Click **"Connect"**

### ✅ STEP 6: Configure Web Service

Fill in settings:

| Field | Value |
|-------|-------|
| Name | `almka-blind` |
| Environment | `PHP` |
| Build Command | `composer install --no-dev && npm install && npm run build` |
| Start Command | `php artisan migrate --force && php artisan serve --host 0.0.0.0 --port $PORT` |
| Plan | `Free` |

### ✅ STEP 7: Create PostgreSQL Database

1. From Render dashboard, click **"+ New"**
2. Click **"PostgreSQL"**
3. Fill in:
   - Name: `almka-blind-db`
   - PostgreSQL Version: `15`
   - Region: Your region
   - Plan: Free
4. Click **"Create Database"**

### ✅ STEP 8: Get Database Credentials

After database is created (takes ~1 minute):

1. Click on the database
2. Copy credentials:
   - **Hostname** → `DB_HOST`
   - **Port** (5432) → `DB_PORT`
   - **Database** (almka_blind) → `DB_DATABASE`
   - **User** → `DB_USERNAME`
   - **Password** → `DB_PASSWORD`

### ✅ STEP 9: Add Environment Variables

In your Web Service dashboard:

1. Click **"Environment"** tab
2. Add each variable:

```
APP_NAME=ALMKA
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_URL=https://almka-blind.onrender.com
LOG_CHANNEL=stack
DB_CONNECTION=pgsql
DB_HOST=[paste from database]
DB_PORT=5432
DB_DATABASE=almka_blind
DB_USERNAME=[paste from database]
DB_PASSWORD=[paste from database]
CACHE_STORE=database
QUEUE_CONNECTION=database
SESSION_DRIVER=database
FILESYSTEM_DISK=local
VITE_API_BASE_URL=/api
```

### ✅ STEP 10: Generate APP_KEY

On your local Windows machine:

```bash
cd C:\xampp\htdocs\ALMKA_Blind
php artisan key:generate --show
```

This outputs something like:
```
base64:AbCdEfGhIjKlMnOpQrStUvWxYz123456789ABC=
```

Copy this value and add to Render environment as `APP_KEY`.

### ✅ STEP 11: Wait for Initial Deploy

Render will automatically start building. Wait for:

1. **Building** → Shows build logs
2. **Live** → Deployment succeeded ✅

### ✅ STEP 12: Test Your App

Visit: `https://almka-blind.onrender.com` (or your Render URL)

You should see:
- ✅ ALMKA login page
- ✅ No 500 errors
- ✅ Database connected

### ✅ STEP 13: Enable Auto-Deploy from GitHub

1. In Render Web Service, click **"Settings"**
2. Find **"Deploy Hook"** section
3. Copy the URL
4. Go to GitHub: https://github.com/alonzoaljon-dev/almka-blind
5. Click **"Settings"** → **"Webhooks"** → **"Add webhook"**
6. Paste Render URL
7. Content type: `application/json`
8. Click **"Add webhook"**

Now every time you push to GitHub, Render automatically deploys! 🚀

---

## RUNNING MIGRATIONS ON RENDER

### Option 1: Automatic (Recommended)

Migrations run automatically on deployment because of:

```bash
php artisan migrate --force
```

In the start command.

### Option 2: Manual via Render Shell

If you need to run migrations manually:

1. In Render Web Service dashboard
2. Click **"Shell"** tab
3. Run:

```bash
php artisan migrate --force
```

### Option 3: Seed Database

In Render Shell:

```bash
php artisan db:seed
```

---

## TROUBLESHOOTING

### ❌ Problem: White Screen (No Errors)

**Causes:** APP_DEBUG=false and error logs not visible

**Solution:**

1. Check Render logs: Dashboard → **"Logs"** tab
2. Look for errors like "Class not found" or "Method not found"
3. Check if migrations ran: In Render Shell, run:
   ```bash
   php artisan migrate --force
   ```

### ❌ Problem: 500 Internal Server Error

**Causes:** Missing environment variables, wrong database credentials, or missing APP_KEY

**Solutions:**

1. Check Render logs for the exact error
2. Verify all environment variables are set
3. Test database connection:
   ```bash
   # In Render Shell
   php artisan tinker
   >>> DB::connection()->getPdo()
   >>> // Should return connection object, not error
   ```

### ❌ Problem: Cannot Connect to Database

**Causes:** Wrong credentials, database not running, or firewall issue

**Solutions:**

1. Double-check database credentials in environment variables
2. In Render dashboard, verify PostgreSQL database shows "Available"
3. Test in Render Shell:
   ```bash
   php artisan tinker
   >>> DB::table('users')->count()
   ```

### ❌ Problem: Build Fails - npm not found

**Cause:** Node.js not installed on Render

**Solution:** Ensure `package.json` exists in project root

### ❌ Problem: Build Fails - composer not found

**Cause:** PHP not configured properly

**Solution:** Check Render Web Service environment is set to "PHP"

### ❌ Problem: Assets not loading (404 errors on CSS/JS)

**Causes:** Vite build not running or public path wrong

**Solutions:**

1. Make sure build command includes: `npm run build`
2. Check Render logs show build succeeded
3. Verify `public/build` directory was created
4. In Render Shell, check:
   ```bash
   ls -la public/build/
   ```
   Should show manifest.json and asset files

### ❌ Problem: Static files not serving (images, videos)

**Causes:** Storage symlink not created

**Solution:** Add to start command:

```bash
php artisan storage:link && php artisan migrate --force && php artisan serve --host 0.0.0.0 --port $PORT
```

### ❌ Problem: CORS Errors

**Cause:** React frontend calling API from different domain

**Solution:** Update `config/cors.php`:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => ['*'],
'allowed_origins_patterns' => [],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => false,
```

### ❌ Problem: Login not working

**Cause:** SESSION_DRIVER not set to database, or migrations didn't run

**Solutions:**

1. Verify `SESSION_DRIVER=database` in environment
2. Check migrations ran: In Render Shell:
   ```bash
   php artisan migrate:status
   ```
   Should show all migrations "✓"

### ❌ Problem: CSRF token errors on form submission

**Cause:** CSRF middleware rejecting requests

**Solution:** Make sure React components include CSRF token:

```javascript
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

fetch('/api/endpoint', {
    method: 'POST',
    headers: {
        'X-CSRF-TOKEN': csrfToken,
        'Content-Type': 'application/json',
    },
})
```

---

## COMMON MISTAKES

### ❌ Mistake 1: Committing `.env` file

**Why bad:** Exposes passwords and secrets

**Solution:** Never commit `.env`
- Make sure `.gitignore` contains `.env`
- Only commit `.env.example`

### ❌ Mistake 2: Forgetting to generate APP_KEY

**Why bad:** Laravel cannot encrypt/decrypt sessions

**Solution:** Always run:
```bash
php artisan key:generate --show
```

Then copy to Render environment.

### ❌ Mistake 3: Using MySQL instead of PostgreSQL

**Why bad:** MySQL not available on Render free tier; PostgreSQL is free

**Solution:** Use PostgreSQL:
```
DB_CONNECTION=pgsql
```

### ❌ Mistake 4: Building frontend locally instead of on Render

**Why bad:** Different environments produce different results

**Solution:** Let Render build:
- Don't commit `/public/build` directory
- Let build command run: `npm run build`

### ❌ Mistake 5: Leaving APP_DEBUG=true in production

**Why bad:** Shows sensitive information in error pages

**Solution:** Always set:
```
APP_DEBUG=false
```

In production environment.

### ❌ Mistake 6: Not running migrations before using app

**Why bad:** Database tables don't exist

**Solution:** Ensure start command includes:
```bash
php artisan migrate --force
```

### ❌ Mistake 7: Using environment variables in config files (wrong)

**Wrong:**
```php
// ❌ BAD
'debug' => getenv('APP_DEBUG'),
```

**Right:**
```php
// ✅ GOOD
'debug' => env('APP_DEBUG', false),
```

### ❌ Mistake 8: Pushing large node_modules or vendor directories

**Why bad:** Makes repository huge and slow

**Solution:** Add to `.gitignore`:
```
vendor/
node_modules/
storage/
public/build/
```

### ❌ Mistake 9: Not caching config and routes in production

**Why bad:** Slower app startup time

**Solution:** Run before deploying:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### ❌ Mistake 10: Trying to use free Render PostgreSQL with multiple web services

**Why bad:** Free tier has resource limits

**Solution:** 
- Use one database for multiple services
- Consider upgrading if you need more resources

---

## AFTER DEPLOYMENT

### ✅ Verify Everything Works

1. **Visit your app:** `https://almka-blind.onrender.com`
2. **Test login page:** Should load without errors
3. **Test database:** Try logging in with test account
4. **Check logs:** In Render → **"Logs"** tab for any warnings

### ✅ Set Up Auto-Redeploy

Every time you push to GitHub, Render redeploys automatically.

Example workflow:

```bash
# Make changes locally
cd C:\xampp\htdocs\ALMKA_Blind
nano resources/js/Pages/Home.jsx

# Commit and push
git add .
git commit -m "Update home page"
git push origin main

# Check Render dashboard - deployment starts automatically! 🚀
```

### ✅ Monitor Logs

Render keeps logs for 24 hours. Check them regularly:

1. Click Web Service in dashboard
2. Click **"Logs"** tab
3. Search for "ERROR" or "Exception"
4. Fix issues and push new commits

### ✅ Set Up Alerts (Optional)

In Render dashboard:

1. Click **"Settings"**
2. Scroll to **"Notifications"**
3. Choose email alerts for deployment failures

### ✅ Back Up Database

PostgreSQL on free tier loses data when service restarts. For production:

1. Upgrade to paid PostgreSQL plan
2. Or use managed service like AWS RDS
3. Set up automated backups

### ✅ Enable HTTPS (Auto)

Render automatically provides HTTPS certificate. Your app is secure! 🔒

### ✅ Set up Custom Domain (Optional)

1. In Render dashboard → **"Settings"**
2. Find **"Custom Domains"**
3. Add your domain (e.g., almka.com)
4. Update DNS with provided values
5. Takes ~5 minutes to activate

---

## QUICK REFERENCE COMMANDS

### Local Development

```bash
# Start Laravel dev server
php artisan serve

# Start Vite dev server (in another terminal)
npm run dev

# Run migrations
php artisan migrate

# Check app
npm run build  # Build frontend before committing
```

### Before Deploying

```bash
# Test locally
npm run build
php artisan config:cache
php artisan route:cache

# Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# Render deploys automatically!
```

### On Render (if needed)

```bash
# In Render Shell:

# Run migrations
php artisan migrate --force

# Check database
php artisan tinker
DB::table('users')->count()

# Clear cache if needed
php artisan cache:clear
php artisan config:clear
```

---

## PRODUCTION CHECKLIST

Before going live:

- [ ] `.env` not in git (in `.gitignore`)
- [ ] `.env.example` committed to git
- [ ] `APP_DEBUG=false` in production
- [ ] `APP_KEY` set on Render
- [ ] Database credentials correct
- [ ] `composer install --no-dev` in build command
- [ ] `npm run build` in build command
- [ ] `php artisan migrate --force` in start command
- [ ] All npm packages installed (`package.json` updated)
- [ ] All Composer packages installed (`composer.json` updated)
- [ ] Vite builds successfully: `npm run build`
- [ ] No console errors: Check browser dev tools
- [ ] Assets loading: Check network tab for CSS/JS files
- [ ] API endpoints responding: Check network tab for `/api/*` calls
- [ ] Database migrations ran: Check Render logs

---

## STILL STUCK?

1. **Check Render Logs:** Dashboard → Logs tab (most helpful!)
2. **Check Browser Console:** F12 → Console tab
3. **Run in Render Shell:**
   ```bash
   php artisan tinker
   >>> // Test commands here
   ```
4. **Contact Render Support:** https://render.com/support

---

**Congratulations! Your Laravel + React + Inertia app is now deployed on Render! 🎉**

For questions or updates: https://render.com/docs
