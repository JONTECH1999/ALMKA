# Render Deployment Configuration Reference

Complete configuration files and examples for ALMKA Blind on Render.

---

## 1. render.yaml - Full Configuration

**Location:** `render.yaml` (in project root)

```yaml
services:
  - type: web
    name: almka-blind
    env: php
    plan: free
    region: oregon
    
    buildCommand: >
      composer install --no-dev --no-interaction &&
      npm install &&
      npm run build
    
    startCommand: >
      php artisan migrate --force &&
      php artisan storage:link &&
      php artisan serve --host 0.0.0.0 --port $PORT
    
    envVars:
      - key: APP_NAME
        value: ALMKA
      - key: APP_ENV
        value: production
      - key: APP_DEBUG
        value: false
      - key: APP_KEY
        scope: web
        sync: false
      - key: APP_URL
        scope: web
        sync: false
      - key: LOG_CHANNEL
        value: stack
      - key: LOG_LEVEL
        value: debug
      - key: DB_CONNECTION
        value: pgsql
      - key: DB_HOST
        scope: web
        sync: false
      - key: DB_PORT
        value: "5432"
      - key: DB_DATABASE
        scope: web
        sync: false
      - key: DB_USERNAME
        scope: web
        sync: false
      - key: DB_PASSWORD
        scope: web
        sync: false
      - key: CACHE_STORE
        value: database
      - key: QUEUE_CONNECTION
        value: database
      - key: SESSION_DRIVER
        value: database
      - key: FILESYSTEM_DISK
        value: local
      - key: VITE_API_BASE_URL
        value: /api

databases:
  - name: almka-blind-db
    databaseName: almka_blind
    user: almka_user
    plan: free
    postgresSQLVersion: "15"
    region: oregon
```

---

## 2. .env.example - Template for Production

**Location:** `.env.example` (in project root, COMMIT to git)

```env
APP_NAME=ALMKA
APP_ENV=production
APP_KEY=base64:YOUR_KEY_HERE
APP_DEBUG=false
APP_URL=https://almka-blind.onrender.com

LOG_CHANNEL=stack
LOG_LEVEL=debug

# PostgreSQL Database
DB_CONNECTION=pgsql
DB_HOST=your-db-host.render.com
DB_PORT=5432
DB_DATABASE=almka_blind
DB_USERNAME=almka_user
DB_PASSWORD=your-password-here

# Cache Configuration
CACHE_STORE=database
CACHE_PREFIX=almka_

# Queue Configuration
QUEUE_CONNECTION=database

# Session Configuration
SESSION_DRIVER=database
SESSION_LIFETIME=120

# File Storage
FILESYSTEM_DISK=local

# Vite Frontend
VITE_API_BASE_URL=/api
```

---

## 3. .env - Local Development Only

**Location:** `.env` (in project root, in `.gitignore`, NOT committed)

```env
APP_NAME=ALMKA
APP_ENV=local
APP_KEY=base64:B8H9LQlwTpEdg0RwG7/qLX96pVQoYGC0qd64vGuuPPg=
APP_DEBUG=true
APP_URL=http://localhost:8000

LOG_CHANNEL=stack
LOG_LEVEL=debug

# Local MySQL Database (XAMPP)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=almka_blind
DB_USERNAME=root
DB_PASSWORD=

# Cache
CACHE_STORE=database

# Queue
QUEUE_CONNECTION=database

# Session
SESSION_DRIVER=database

# Files
FILESYSTEM_DISK=local

# Frontend
VITE_API_BASE_URL=/api
```

---

## 4. vite.config.js - Production Optimized

**Location:** `vite.config.js` (in project root)

```javascript
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'

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
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', '@inertiajs/react'],
                },
            },
        },
    },
    server: {
        hmr: {
            host: 'localhost',
            port: 5173,
        },
    },
    optimizeDeps: {
        include: ['react', 'react-dom', '@inertiajs/react'],
    },
})
```

---

## 5. tailwind.config.js - Example

**Location:** `tailwind.config.js` (in project root)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.jsx",
    "./resources/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        almka: '#1e40af',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

---

## 6. postcss.config.js - CSS Processing

**Location:** `postcss.config.js` (in project root)

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

## 7. tsconfig.json - TypeScript Configuration

**Location:** `tsconfig.json` (in project root)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["resources/js/*"]
    },
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": false,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["resources"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 8. config/app.php - Laravel Configuration

**Location:** `config/app.php` (excerpt)

```php
return [
    'name' => env('APP_NAME', 'ALMKA'),
    'env' => env('APP_ENV', 'production'),
    'debug' => env('APP_DEBUG', false),
    'url' => env('APP_URL', 'http://localhost'),
    'asset_url' => env('ASSET_URL'),
    'timezone' => 'UTC',
    'locale' => 'en',
    'fallback_locale' => 'en',
    'faker_locale' => 'en_US',
    'key' => env('APP_KEY'),
    'cipher' => 'AES-256-CBC',
    'providers' => [
        // Service providers...
    ],
    'aliases' => [
        // Aliases...
    ],
];
```

---

## 9. config/database.php - Database Configuration

**Location:** `config/database.php` (excerpt for PostgreSQL)

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

---

## 10. config/filesystems.php - Storage Configuration

**Location:** `config/filesystems.php` (excerpt)

```php
'disks' => [
    'local' => [
        'driver' => 'local',
        'root' => storage_path('app'),
        'url' => env('APP_URL').'/storage',
        'visibility' => 'private',
    ],

    'public' => [
        'driver' => 'local',
        'root' => storage_path('app/public'),
        'url' => env('APP_URL').'/storage',
        'visibility' => 'public',
    ],
],
```

---

## 11. composer.json - PHP Dependencies

**Location:** `composer.json` (excerpt)

```json
{
  "require": {
    "php": "^8.1",
    "laravel/framework": "^12.0",
    "laravel/tinker": "^2.9",
    "inertiajs/inertia-laravel": "^0.6",
    "laravel/breeze": "^2.0"
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
    ],
    "post-update-cmd": [
      "@php artisan vendor:publish --force"
    ]
  }
}
```

---

## 12. package.json - Node.js Dependencies

**Location:** `package.json`

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
    "laravel-vite-plugin": "^0.8",
    "tailwindcss": "^3.0",
    "vite": "^5.0"
  },
  "dependencies": {
    "@inertiajs/core": "^1.0",
    "react": "^18.0",
    "react-dom": "^18.0"
  }
}
```

---

## 13. resources/views/app.blade.php - Inertia Root

**Location:** `resources/views/app.blade.php`

```blade
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title inertia>{{ config('app.name', 'ALMKA') }}</title>
    <link rel="shortcut icon" href="{{ asset('favicon.ico') }}" type="image/x-icon">
    @vite('resources/js/app.jsx')
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
```

---

## 14. resources/js/app.jsx - React Entry Point

**Location:** `resources/js/app.jsx`

```javascript
import './bootstrap'
import '../css/app.css'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'

createInertiaApp({
    resolve: (name) => resolvePageComponent(
        `./Pages/${name}.jsx`,
        import.meta.glob('./Pages/**/*.jsx'),
    ),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />)
    },
}).catch((error) => {
    console.error('Failed to mount Inertia app:', error)
})
```

---

## 15. resources/js/bootstrap.js - Axios Configuration

**Location:** `resources/js/bootstrap.js`

```javascript
import axios from 'axios'

window.axios = axios
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
window.axios.defaults.headers.common['X-CSRF-TOKEN'] = 
    document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')

export default axios
```

---

## 16. .gitignore - Files NOT to Commit

**Location:** `.gitignore` (in project root)

```
# Dependencies
/vendor
/node_modules
/composer.lock
/package-lock.json

# Build and compiled files
/public/build
/public/hot

# Environment
.env
.env.local
.env.*.local

# IDE and Editor
.vscode/
.idea/
.DS_Store
Thumbs.db
*.swp
*.swo
*~

# Laravel
bootstrap/cache/*
storage/app/*
storage/framework/cache/*
storage/framework/sessions/*
storage/framework/views/*
storage/logs/*
*.key

# Misc
.git/
.gitignore
.editorconfig
```

---

## 17. routes/api.php - API Routes Example

**Location:** `routes/api.php`

```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DataLoggerController;

Route::middleware('api')->group(function () {
    // Location endpoints
    Route::get('/logger/location-history', [DataLoggerController::class, 'getLocationHistory']);
    Route::post('/logger/location', [DataLoggerController::class, 'recordLocation']);
    Route::delete('/logger/location/{id}', [DataLoggerController::class, 'deleteLocation']);
    
    // Video endpoints
    Route::get('/logger/video-history', [DataLoggerController::class, 'getVideoHistory']);
    Route::post('/logger/video', [DataLoggerController::class, 'recordVideo']);
    Route::delete('/logger/video/{id}', [DataLoggerController::class, 'deleteVideo']);
    
    // Sensor endpoints
    Route::post('/logger/data', [DataLoggerController::class, 'logSensorData']);
});
```

---

## 18. Environment Variables Summary

**Production Render Variables:**

```
APP_NAME=ALMKA
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:[GENERATED_KEY]
APP_URL=https://almka-blind.onrender.com
LOG_CHANNEL=stack
LOG_LEVEL=debug
DB_CONNECTION=pgsql
DB_HOST=[RENDER_DB_HOST]
DB_PORT=5432
DB_DATABASE=almka_blind
DB_USERNAME=[RENDER_DB_USER]
DB_PASSWORD=[RENDER_DB_PASSWORD]
CACHE_STORE=database
QUEUE_CONNECTION=database
SESSION_DRIVER=database
FILESYSTEM_DISK=local
VITE_API_BASE_URL=/api
```

**How to get DB values from Render:**
1. Go to PostgreSQL database in Render
2. Copy credentials from connection string
3. Example connection string:
   `postgresql://almka_user:password@host.render.com:5432/almka_blind`
4. Extract parts:
   - Username: `almka_user`
   - Password: `password`
   - Host: `host.render.com`
   - Database: `almka_blind`
   - Port: `5432` (default)

---

## 19. Deployment Checklist

Before deploying to Render:

- [ ] All code committed to GitHub `main` branch
- [ ] `.env` in `.gitignore` (NOT committed)
- [ ] `.env.example` committed with correct structure
- [ ] `composer.json` includes all production dependencies
- [ ] `package.json` includes all production dependencies
- [ ] `vite.config.js` configured for production build
- [ ] Laravel config caching commands run locally
- [ ] Frontend builds successfully: `npm run build`
- [ ] No console errors in local development
- [ ] Database migrations written and tested
- [ ] APP_KEY generated: `php artisan key:generate --show`
- [ ] render.yaml created and committed
- [ ] All environment variables defined
- [ ] PostgreSQL database created on Render

---

## 20. Quick Reference Commands

**Local Development:**
```bash
# Windows PowerShell
cd C:\xampp\htdocs\ALMKA_Blind

# Install dependencies
composer install
npm install

# Run development servers
php artisan serve
npm run dev  # In separate terminal

# Build for production
npm run build

# Run migrations
php artisan migrate

# Cache for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**Git Workflow:**
```bash
# Check status
git status

# Commit changes
git add .
git commit -m "Your message"

# Push to GitHub
git push origin main

# Render auto-deploys!
```

**Render Shell (for debugging):**
```bash
# Test database
php artisan tinker
DB::table('users')->count()

# Run migrations
php artisan migrate --force

# Clear cache
php artisan cache:clear

# View logs
tail -f storage/logs/laravel.log
```

---

**Need help?** Check the comprehensive guide: `RENDER_DEPLOYMENT_GUIDE.md`
