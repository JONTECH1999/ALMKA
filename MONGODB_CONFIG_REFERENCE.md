# MongoDB Configuration Reference for ALMKA Blind

Quick configuration files for MongoDB setup locally and on Render.

---

## 1. .env - Local MongoDB Development

**Location:** `.env` (in project root, NOT committed)

```env
APP_NAME=ALMKA
APP_ENV=local
APP_DEBUG=true
APP_KEY=base64:B8H9LQlwTpEdg0RwG7/qLX96pVQoYGC0qd64vGuuPPg=
APP_URL=http://localhost:8000

LOG_CHANNEL=stack
LOG_LEVEL=debug

# MongoDB Local Configuration
DB_CONNECTION=mongodb
DB_HOST=127.0.0.1
DB_PORT=27017
DB_DATABASE=almka_blind
DB_USERNAME=
DB_PASSWORD=

# Cache and Session
CACHE_STORE=database
SESSION_DRIVER=database
QUEUE_CONNECTION=database
FILESYSTEM_DISK=local

# Frontend
VITE_API_BASE_URL=/api
```

---

## 2. .env.example - MongoDB Production Template

**Location:** `.env.example` (in project root, COMMIT to git)

```env
APP_NAME=ALMKA
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:YOUR_KEY_HERE
APP_URL=https://almka-blind.onrender.com

LOG_CHANNEL=stack
LOG_LEVEL=debug

# MongoDB Atlas (Cloud)
DB_CONNECTION=mongodb
DB_HOST=your-cluster.mongodb.net
DB_PORT=27017
DB_DATABASE=almka_blind
DB_USERNAME=almka_user
DB_PASSWORD=your-password-here

# Cache and Session
CACHE_STORE=database
SESSION_DRIVER=database
QUEUE_CONNECTION=database
FILESYSTEM_DISK=local

# Frontend
VITE_API_BASE_URL=/api
```

---

## 3. config/database.php - MongoDB Setup

**Location:** `config/database.php` (excerpt for MongoDB)

```php
'connections' => [
    'mongodb' => [
        'driver' => 'mongodb',
        'host' => env('DB_HOST', 'localhost'),
        'port' => env('DB_PORT', 27017),
        'database' => env('DB_DATABASE', 'almka_blind'),
        'username' => env('DB_USERNAME'),
        'password' => env('DB_PASSWORD'),
        'options' => [
            'authSource' => env('DB_AUTH_SOURCE', 'admin'),
            'retryWrites' => true,
            'w' => 'majority',
        ],
    ],

    'mongodb-atlas' => [
        'driver' => 'mongodb',
        'dsn' => env('DB_DSN'),
        'database' => env('DB_DATABASE', 'almka_blind'),
        'options' => [
            'retryWrites' => true,
            'w' => 'majority',
        ],
    ],
],
```

---

## 4. composer.json - Add MongoDB Driver

Add to `require` section:

```json
{
  "require": {
    "php": "^8.1",
    "laravel/framework": "^12.0",
    "laravel/tinker": "^2.9",
    "inertiajs/inertia-laravel": "^0.6",
    "jenssegers/mongodb": "^3.9"
  }
}
```

Install with:
```bash
composer require jenssegers/mongodb
```

---

## 5. Base Model for MongoDB

**Location:** `app/Models/BaseModel.php` (Optional - for consistency)

```php
<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

abstract class BaseModel extends Model
{
    protected $connection = 'mongodb';
    protected $dates = ['created_at', 'updated_at'];
}
```

---

## 6. Example: User Model for MongoDB

**Location:** `app/Models/User.php`

```php
<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Foundation\Auth\Access\Authorizable;

class User extends Model implements 
    \Illuminate\Contracts\Auth\Authenticatable,
    \Illuminate\Contracts\Auth\Access\Authorizable
{
    use Authenticatable, Authorizable, CanResetPassword;

    protected $connection = 'mongodb';
    protected $collection = 'users';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
```

---

## 7. Example: LocationHistory Model

**Location:** `app/Models/LocationHistory.php`

```php
<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class LocationHistory extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'location_histories';

    protected $fillable = [
        'user_id',
        'device_id',
        'latitude',
        'longitude',
        'address',
        'incident_type',
        'timestamp',
        'battery_level',
        'signal_strength',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'battery_level' => 'integer',
        'signal_strength' => 'integer',
        'timestamp' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

---

## 8. Example: VideoRecording Model

**Location:** `app/Models/VideoRecording.php`

```php
<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class VideoRecording extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'video_recordings';

    protected $fillable = [
        'user_id',
        'device_id',
        'file_path',
        'file_size',
        'duration',
        'location_latitude',
        'location_longitude',
        'location_address',
        'status',
        'created_at',
    ];

    protected $casts = [
        'file_size' => 'integer',
        'duration' => 'float',
        'location_latitude' => 'float',
        'location_longitude' => 'float',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

---

## 9. Example: SensorReading Model

**Location:** `app/Models/SensorReading.php`

```php
<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class SensorReading extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'sensor_readings';

    protected $fillable = [
        'device_id',
        'ultrasonic_distance',
        'temperature',
        'humidity',
        'air_quality',
        'timestamp',
    ];

    protected $casts = [
        'ultrasonic_distance' => 'float',
        'temperature' => 'float',
        'humidity' => 'float',
        'air_quality' => 'float',
        'timestamp' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
```

---

## 10. Example: DeviceSession Model

**Location:** `app/Models/DeviceSession.php`

```php
<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class DeviceSession extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'device_sessions';

    protected $fillable = [
        'user_id',
        'device_id',
        'status',
        'started_at',
        'ended_at',
        'gps_enabled',
        'camera_enabled',
    ];

    protected $casts = [
        'gps_enabled' => 'boolean',
        'camera_enabled' => 'boolean',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

---

## 11. Migration: Create Collections

**Location:** `database/migrations/2024_01_01_000000_create_mongodb_collections.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Create users collection with index
        DB::connection('mongodb')->collection('users')->createIndex(['email' => 1], ['unique' => true]);

        // Create location_histories collection with indexes
        DB::connection('mongodb')->collection('location_histories')->createIndex(['user_id' => 1]);
        DB::connection('mongodb')->collection('location_histories')->createIndex(['timestamp' => -1]);
        DB::connection('mongodb')->collection('location_histories')->createIndex(['user_id' => 1, 'timestamp' => -1]);

        // Create video_recordings collection with indexes
        DB::connection('mongodb')->collection('video_recordings')->createIndex(['user_id' => 1]);
        DB::connection('mongodb')->collection('video_recordings')->createIndex(['created_at' => -1]);
        DB::connection('mongodb')->collection('video_recordings')->createIndex(['user_id' => 1, 'created_at' => -1]);

        // Create sensor_readings collection with indexes
        DB::connection('mongodb')->collection('sensor_readings')->createIndex(['device_id' => 1]);
        DB::connection('mongodb')->collection('sensor_readings')->createIndex(['timestamp' => -1]);
        DB::connection('mongodb')->collection('sensor_readings')->createIndex(['device_id' => 1, 'timestamp' => -1]);

        // Create device_sessions collection with index
        DB::connection('mongodb')->collection('device_sessions')->createIndex(['user_id' => 1]);
        DB::connection('mongodb')->collection('device_sessions')->createIndex(['device_id' => 1]);
    }

    public function down(): void
    {
        DB::connection('mongodb')->collection('users')->drop();
        DB::connection('mongodb')->collection('location_histories')->drop();
        DB::connection('mongodb')->collection('video_recordings')->drop();
        DB::connection('mongodb')->collection('sensor_readings')->drop();
        DB::connection('mongodb')->collection('device_sessions')->drop();
    }
};
```

---

## 12. render.yaml - MongoDB Configuration

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
        value: mongodb
      - key: DB_HOST
        scope: web
        sync: false
      - key: DB_PORT
        value: "27017"
      - key: DB_DATABASE
        value: almka_blind
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
```

---

## 13. MongoDB Atlas Connection String

**Example Atlas Connection String:**

```
mongodb+srv://almka_user:PASSWORD@almka-cluster.mongodb.net/almka_blind?retryWrites=true&w=majority&appName=ALMKA
```

**For Render .env variables, extract:**

```
DB_CONNECTION=mongodb
DB_HOST=almka-cluster.mongodb.net
DB_PORT=27017
DB_DATABASE=almka_blind
DB_USERNAME=almka_user
DB_PASSWORD=YourSecurePassword123
```

---

## 14. Quick Setup Commands

**Local MongoDB Setup:**

```bash
# 1. Install MongoDB driver
composer require jenssegers/mongodb

# 2. Update .env
# DB_CONNECTION=mongodb
# DB_HOST=127.0.0.1
# DB_PORT=27017

# 3. Create migration
php artisan make:migration create_mongodb_collections

# 4. Run migration
php artisan migrate

# 5. Start Laravel
php artisan serve

# 6. Start Vite (another terminal)
npm run dev
```

**MongoDB Atlas Setup:**

```bash
# 1. Go to https://www.mongodb.com/cloud/atlas
# 2. Create free cluster
# 3. Create user: almka_user
# 4. Get connection string
# 5. Add to Render environment variables
# 6. Deploy!
```

---

## 15. Local Development Checklist

- [ ] MongoDB Community installed and running
- [ ] `composer require jenssegers/mongodb` installed
- [ ] `.env` updated with MongoDB connection
- [ ] Migration created and run: `php artisan migrate`
- [ ] Models updated with MongoDB base class
- [ ] Tests passing locally
- [ ] Data verified in MongoDB Compass
- [ ] Git committed: `git add . && git commit -m "Migrate to MongoDB"`

---

## 16. Render Deployment Checklist

- [ ] MongoDB Atlas account created
- [ ] Free cluster created
- [ ] Database user created (almka_user)
- [ ] Network access allowed
- [ ] Connection string obtained
- [ ] Render environment variables added
- [ ] render.yaml uses MongoDB config
- [ ] Build command updated
- [ ] Start command updated
- [ ] App deploys successfully
- [ ] Data accessible after deployment

---

**Ready to use!** Copy these configurations into your project and follow the main guide.
