# Complete Hostinger Deployment Guide for Laravel Apps

**This guide is for Hostinger shared hosting. Follow these steps every time you deploy your Laravel application.**

---

## Table of Contents
1. [Before You Start](#before-you-start)
2. [Step 1: Prepare Your App Locally](#step-1-prepare-your-app-locally)
3. [Step 2: Set Up Hostinger](#step-2-set-up-hostinger)
4. [Step 3: Upload Files](#step-3-upload-files)
5. [Step 4: Configure on Hostinger](#step-4-configure-on-hostinger)
6. [Step 5: Test & Go Live](#step-5-test--go-live)
7. [Troubleshooting](#troubleshooting)

---

## Before You Start

**What you need:**
- Hostinger account with a domain (e.g., `gabay.pro`)
- FTP credentials from Hostinger
- Database credentials from Hostinger
- Your local Laravel app ready

**Time needed:** 30-45 minutes

---

## Step 1: Prepare Your App Locally

### 1.1 Install Dependencies
Open terminal in your Laravel app folder and run:
```bash
composer install --no-dev --optimize-autoloader
```
This installs only production dependencies (excludes dev packages like PHPUnit).

### 1.2 Build Frontend Assets
If you use Vite/Tailwind (like your app does), compile CSS/JS:
```bash
npm run build
```
This creates optimized files in `public/build/` folder.

### 1.3 Generate App Key
```bash
php artisan key:generate
```
This creates a secure encryption key. Only run once.

### 1.4 Create/Update .env File
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` for **local testing first** (use same DB you'll use on Hostinger):
```env
APP_NAME=ALMKA
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u770158746_almka
DB_USERNAME=u770158746_almka
DB_PASSWORD=u770158746_almkaA@

SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database
```

### 1.5 Test Locally
```bash
php artisan serve
```
Open `http://localhost:8000` and verify everything works.

### 1.6 Clear & Cache Everything
```bash
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## Step 2: Set Up Hostinger

### 2.1 Create Database
1. Log into **Hostinger hPanel**
2. Go to **Databases > MySQL Databases**
3. Click **New Database**
4. Enter database name (example: `u770158746_almka`)
5. Create database user with secure password
6. **Save these credentials:**
   - Database name
   - Username
   - Password
   - Host (usually `localhost` on shared hosting)

### 2.2 Enable Required PHP Extensions
1. In hPanel, go to **PHP Configuration** or **PHP Settings**
2. Verify these extensions are enabled:
   - `pdo_mysql`
   - `mbstring`
   - `openssl`
   - `curl`
   - `json`
3. Ensure PHP version is **8.1 or higher**

### 2.3 Get FTP Credentials
1. Go to **Files > FTP Accounts** in hPanel
2. Create or use existing FTP account
3. Save:
   - FTP Host
   - FTP Username
   - FTP Password
   - FTP Port (usually 21)

---

## Step 3: Upload Files

### 3.1 Connect via FTP
Use FTP client like FileZilla:
1. Host: `ftp.yourdomain.com` (from hPanel)
2. Username: your FTP username
3. Password: your FTP password
4. Port: 21

### 3.2 Navigate to public_html
In FTP, you should see a folder called `public_html`. This is your web root.

### 3.3 Delete Existing Files (if redeploying)
If uploading a new version, delete:
- Old `public_html/index.php`
- Old `public_html/.htaccess`
- Old `public_html/public/` files (if this structure exists)

**Do NOT delete:**
- `public_html/storage/` (contains user uploads)
- `public_html/bootstrap/cache/` (we'll clear it later)

### 3.4 Upload Your App
From your local machine, upload everything **except:**
- `.git/` folder
- `node_modules/` folder
- `tests/` folder (optional for production)
- `.env.example` file
- `.gitignore` file
- Local `.env` with local DB credentials

**Upload to: `public_html/`**

This will create:
```
public_html/
├── app/
├── bootstrap/
├── config/
├── database/
├── public/     (Laravel's public folder gets uploaded here)
├── resources/
├── routes/
├── storage/
├── vendor/     (include this - composer dependencies)
├── .env        (production .env file)
├── artisan
└── ... (other files)
```

**IMPORTANT:** Move contents of `public/` to `public_html/`:
- Upload everything from your `public/` folder to `public_html/` (merge with existing files)
- Example: `public/index.php` → `public_html/index.php`
- Example: `public/.htaccess` → `public_html/.htaccess`

### 3.5 Verify Upload
In FTP, confirm you see:
- `index.php` in `public_html/`
- `.htaccess` in `public_html/`
- `app/`, `bootstrap/`, `config/`, etc. in `public_html/`

---

## Step 4: Configure on Hostinger

### 4.1 Update .env on Server
1. Via FTP or File Manager, locate `public_html/.env`
2. Edit and update these values to match your Hostinger database:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://gabay.pro

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u770158746_almka
DB_USERNAME=u770158746_almka
DB_PASSWORD=u770158746_almkaA@

SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database
```

**Replace with your actual credentials from Step 2.1**

### 4.2 Clear Cached Config
Delete this file via File Manager:
```
public_html/bootstrap/cache/config.php
```

**Why?** This file caches your old local `.env` settings. Deleting it forces Laravel to rebuild it from the new `.env`.

### 4.3 Set Permissions (if possible via SSH)
If you have SSH access (premium plans), run:
```bash
chmod -R 755 public_html/storage/
chmod -R 755 public_html/bootstrap/cache/
```

If no SSH, File Manager should handle permissions automatically. If you get permission errors later, contact Hostinger support to set write permissions on `storage/` and `bootstrap/cache/`.

### 4.4 Run Migrations (if needed)
**Option A: Via SSH (if available):**
```bash
cd public_html
php artisan migrate
```

**Option B: Via FTP upload method:**
Upload `artisan` file (already in FTP upload), then create a PHP script that runs migrations:
1. Create file `public_html/run-migration.php`:
```php
<?php
require_once 'vendor/autoload.php';
require_once 'bootstrap/app.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);

$status = $kernel->handle(
    $input = new \Symfony\Component\Console\Input\StringInput('migrate'),
    new \Symfony\Component\Console\Output\BufferedOutput
);

echo "Migration completed";
?>
```
2. Visit `https://gabay.pro/run-migration.php` in browser
3. Delete `run-migration.php` after it completes

---

## Step 5: Test & Go Live

### 5.1 Point Domain to Hostinger
1. Go to your domain registrar settings
2. Update nameservers to Hostinger's nameservers (provided in hPanel)
3. Wait 24 hours for propagation (may be faster)

### 5.2 Enable SSL Certificate
1. In hPanel, go to **SSL Certificate**
2. Enable free Let's Encrypt SSL
3. Refresh browser and verify `https://` works

### 5.3 Test the Site
1. Visit `https://gabay.pro`
2. Verify pages load without errors
3. Test login, database queries, file uploads

### 5.4 Check Error Logs
If something breaks, check logs via File Manager:
```
public_html/storage/logs/laravel.log
```

---

## Troubleshooting

### Problem: 500 Internal Server Error

**Check:**
1. Is `.env` uploaded with correct DB credentials?
2. Did you delete `bootstrap/cache/config.php`?
3. Are database credentials correct?
4. Does the database exist in Hostinger?

**Fix:**
- Verify credentials in Hostinger phpMyAdmin
- Check `storage/logs/laravel.log` for the exact error
- Contact Hostinger support if database connection fails

### Problem: 403 Forbidden

**Check:**
1. Is `index.php` in `public_html/` (not in a subfolder)?
2. Are file permissions correct?

**Fix:**
- Ensure files are in `public_html/`, not `public_html/public_html/`
- Ask Hostinger to set write permissions on `storage/` and `bootstrap/cache/`

### Problem: Database Connection Refused

**Check:**
1. `DB_HOST=localhost` (not `127.0.0.1` on shared hosting)
2. Database credentials match exactly
3. Database user has been assigned to the database

**Fix:**
- Open Hostinger phpMyAdmin and verify credentials work
- Re-check `.env` spelling
- Delete `bootstrap/cache/config.php` again

### Problem: Blank White Page

**Check:**
1. `APP_DEBUG=false` might be hiding errors
2. Temporarily set `APP_DEBUG=true` to see errors
3. Check `storage/logs/laravel.log`

### Problem: 404 on Custom Routes

**Check:**
1. Is `.htaccess` in `public_html/` (not uploaded)?
2. Are rewrite rules enabled?

**Fix:**
- Contact Hostinger to enable `mod_rewrite` in Apache

---

## Quick Redeployment Checklist

When updating your app later:

- [ ] Run `npm run build` (rebuild CSS/JS)
- [ ] Run `php artisan config:clear` (locally)
- [ ] Run `php artisan cache:clear` (locally)
- [ ] Upload updated files via FTP (skip `node_modules/`, `tests/`, `.git/`)
- [ ] Update `.env` if credentials changed
- [ ] Delete `bootstrap/cache/config.php` on Hostinger
- [ ] Test site loads without errors
- [ ] Check `storage/logs/laravel.log` for any warnings

---

## Important Security Notes

1. **Never commit `.env` to Git** - it contains passwords
2. **Always set `APP_DEBUG=false` on production** - disables error exposure
3. **Use HTTPS only** - enable SSL in Hostinger
4. **Keep dependencies fresh** - occasionally run `composer update`
5. **Back up database regularly** - use Hostinger's backup tools

---

## Support

- Hostinger Support: hPanel Help Center (24/7 chat)
- Laravel Docs: https://laravel.com/docs
- Common issues: Check `storage/logs/laravel.log`

---

**Last Updated:** April 2026
**Laravel Version:** 12.56.0
**PHP Version:** 8.3+
