# 🔄 MySQL to MongoDB Migration Guide for ALMKA Blind

**Converting from MySQL (XAMPP) to MongoDB**

---

## 📋 OVERVIEW

You're switching from:
- ❌ **MySQL** (via XAMPP) → ✅ **MongoDB** (local + cloud)

**What changes:**
- Database storage engine (relational → document-based)
- Configuration files
- Migration strategy
- Query methods

**What stays the same:**
- Laravel framework
- React frontend
- Inertia.js integration
- API routes

---

## 🎯 WHAT YOU'LL DO

1. ✅ Install MongoDB locally on Windows
2. ✅ Install Laravel MongoDB driver
3. ✅ Update configuration files
4. ✅ Convert database migrations to MongoDB models
5. ✅ Test locally
6. ✅ Deploy to Render with MongoDB Atlas
7. ✅ Migrate data from MySQL to MongoDB

---

## PART 1: INSTALL MONGODB LOCALLY

### Step 1: Download MongoDB Community Server

1. Go to: https://www.mongodb.com/try/download/community
2. Select:
   - **OS:** Windows
   - **Version:** Latest (6.0+)
   - **Package:** MSI (installer)
3. Click **"Download"**

### Step 2: Run MongoDB Installer

1. Run `mongodb-windows-x86_64-7.0.msi` (or latest version)
2. Click **"Next"**
3. Accept license → **"Next"**
4. Choose installation type: **"Complete"** → **"Next"**
5. MongoDB Service Configuration:
   - ✅ Check: **"Install MongoDB as a Service"**
   - ✅ Check: **"Run the MongoDB service"**
   - Service Name: `MongoDB`
   - Service User: Local System (default)
   - Click **"Next"**
6. Install MongoDB Compass (optional but recommended)
7. Click **"Install"**
8. Click **"Finish"**

### Step 3: Verify MongoDB is Running

Open PowerShell as Admin:

```powershell
# Check if MongoDB service is running
Get-Service MongoDB

# Should show: Status=Running
```

If not running, start it:

```powershell
Start-Service MongoDB
```

### Step 4: Test MongoDB Connection

Open new PowerShell window and run:

```powershell
mongosh
```

You should see:

```
test> 
```

This means MongoDB is running! Type `exit` to quit.

---

## PART 2: INSTALL LARAVEL MONGODB DRIVER

### Step 1: Install via Composer

In your project directory:

```bash
cd C:\xampp\htdocs\ALMKA_Blind

# Install MongoDB for Laravel
composer require jenssegers/mongodb
```

This takes ~1-2 minutes.

### Step 2: Update `config/database.php`

Edit: `C:\xampp\htdocs\ALMKA_Blind\config\database.php`

Add MongoDB connection (add this to the `'connections'` array):

```php
'connections' => [
    // ... existing sqlite connection ...
    
    'mongodb' => [
        'driver' => 'mongodb',
        'host' => env('DB_HOST', 'localhost'),
        'port' => env('DB_PORT', 27017),
        'database' => env('DB_DATABASE', 'almka_blind'),
        'username' => env('DB_USERNAME'),
        'password' => env('DB_PASSWORD'),
        'options' => [
            'authSource' => 'admin',
            'retryWrites' => true,
        ],
    ],
],
```

### Step 3: Update `.env` File

Edit: `C:\xampp\htdocs\ALMKA_Blind\.env`

```env
DB_CONNECTION=mongodb
DB_HOST=127.0.0.1
DB_PORT=27017
DB_DATABASE=almka_blind
DB_USERNAME=
DB_PASSWORD=
```

**Note:** No username/password needed for local MongoDB by default.

---

## PART 3: CREATE MONGODB MODELS

### Option A: Convert Existing Models to MongoDB

Edit each model file and add `use MongoDB\Laravel\Eloquent\Model;`

**Example: `app/Models/LocationHistory.php`**

```php
<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class LocationHistory extends Model
{
    protected $collection = 'location_histories';
    
    protected $fillable = [
        'user_id',
        'latitude',
        'longitude',
        'address',
        'incident_type',
        'timestamp',
    ];
    
    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'timestamp' => 'datetime',
    ];
}
```

### Option B: Create New Models

Create all your models using MongoDB base class:

```bash
php artisan make:model LocationHistory --migration
```

Edit the model file and change:

```php
// FROM:
use Illuminate\Database\Eloquent\Model;

// TO:
use MongoDB\Laravel\Eloquent\Model;
```

---

## PART 4: CREATE MONGODB MIGRATIONS

### Understanding MongoDB Migrations

MongoDB doesn't use traditional table migrations. Instead, you define collections in migration files.

### Create Migration Files

```bash
cd C:\xampp\htdocs\ALMKA_Blind

# Create migration for users
php artisan make:migration create_users_collection

# Create migration for locations
php artisan make:migration create_location_histories_collection

# Create migration for videos
php artisan make:migration create_video_recordings_collection

# Create migration for sensors
php artisan make:migration create_sensor_readings_collection
```

### Example Migration 1: Users Collection

Edit: `database/migrations/XXXX_XX_XX_XXXXXX_create_users_collection.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        // MongoDB automatically creates collection when first document is inserted
        // This migration ensures the collection structure
        $users = DB::connection('mongodb')->collection('users');
        $users->insertOne([
            'name' => 'System',
            'email' => 'system@almka.local',
            'password' => bcrypt('password'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        DB::connection('mongodb')->collection('users')->drop();
    }
};
```

### Example Migration 2: Location Histories Collection

Edit: `database/migrations/XXXX_XX_XX_XXXXXX_create_location_histories_collection.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        DB::connection('mongodb')->collection('location_histories')->createIndex(
            ['user_id' => 1],
            ['name' => 'user_id_index']
        );
        
        DB::connection('mongodb')->collection('location_histories')->createIndex(
            ['timestamp' => -1],
            ['name' => 'timestamp_index']
        );
    }

    public function down(): void
    {
        DB::connection('mongodb')->collection('location_histories')->drop();
    }
};
```

### Example Migration 3: Video Recordings Collection

```php
<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        DB::connection('mongodb')->collection('video_recordings')->createIndex(
            ['user_id' => 1, 'created_at' => -1],
            ['name' => 'user_video_index']
        );
    }

    public function down(): void
    {
        DB::connection('mongodb')->collection('video_recordings')->drop();
    }
};
```

### Example Migration 4: Sensor Readings Collection

```php
<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        DB::connection('mongodb')->collection('sensor_readings')->createIndex(
            ['device_id' => 1, 'timestamp' => -1],
            ['name' => 'device_sensor_index']
        );
    }

    public function down(): void
    {
        DB::connection('mongodb')->collection('sensor_readings')->drop();
    }
};
```

---

## PART 5: CONVERT DATABASE MODELS

### User Model

**File:** `app/Models/User.php`

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
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
```

### LocationHistory Model

**File:** `app/Models/LocationHistory.php`

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
        'latitude',
        'longitude',
        'address',
        'incident_type',
        'timestamp',
        'device_id',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'timestamp' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

### VideoRecording Model

**File:** `app/Models/VideoRecording.php`

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
        'created_at',
    ];

    protected $casts = [
        'file_size' => 'integer',
        'duration' => 'float',
        'location_latitude' => 'float',
        'location_longitude' => 'float',
        'created_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

### SensorReading Model

**File:** `app/Models/SensorReading.php`

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
        'timestamp',
    ];

    protected $casts = [
        'ultrasonic_distance' => 'float',
        'temperature' => 'float',
        'humidity' => 'float',
        'timestamp' => 'datetime',
    ];
}
```

---

## PART 6: UPDATE CONTROLLERS

Your API controller needs small changes for MongoDB.

**File:** `app/Http/Controllers/DataLoggerController.php`

### getLocationHistory() Method

```php
public function getLocationHistory(Request $request)
{
    try {
        $hours = $request->query('hours', 24);
        $limit = $request->query('limit', 100);
        
        $timeFrom = now()->subHours($hours);
        
        // MongoDB query
        $locations = LocationHistory::where('timestamp', '>=', $timeFrom)
            ->orderBy('timestamp', 'desc')
            ->limit($limit)
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $locations,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage(),
        ], 500);
    }
}
```

### recordLocation() Method

```php
public function recordLocation(Request $request)
{
    try {
        $location = LocationHistory::create([
            'user_id' => auth()->id(),
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'address' => $request->address,
            'incident_type' => $request->incident_type ?? 'auto',
            'timestamp' => now(),
            'device_id' => $request->device_id,
        ]);
        
        return response()->json([
            'success' => true,
            'data' => $location,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage(),
        ], 500);
    }
}
```

### deleteLocation() Method

```php
public function deleteLocation(Request $request, $id)
{
    try {
        $location = LocationHistory::findOrFail($id);
        $location->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Location record deleted successfully',
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to delete location record: ' . $e->getMessage(),
        ], 500);
    }
}
```

---

## PART 7: TEST LOCALLY

### Step 1: Run Migrations

```bash
cd C:\xampp\htdocs\ALMKA_Blind

php artisan migrate
```

### Step 2: Start Development Server

```powershell
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Vite dev server
npm run dev
```

### Step 3: Test in Browser

Visit: `http://localhost:8000`

Should see ALMKA login page ✅

### Step 4: Verify MongoDB Data

Open MongoDB Compass (installed earlier):

1. Click **"Connect"**
2. Connection string: `mongodb://localhost:27017`
3. Click **"Connect"**
4. Expand database `almka_blind`
5. See collections: `users`, `location_histories`, `video_recordings`, etc.

---

## PART 8: MIGRATE DATA FROM MYSQL TO MONGODB

### Create Migration Script

Create: `database/migrations/migrate_mysql_to_mongodb.php`

```bash
php artisan tinker
```

Then in Tinker:

```php
// Get all MySQL data
$mysqlLocations = DB::connection('mysql')->table('location_histories')->get();

// Insert into MongoDB
foreach ($mysqlLocations as $location) {
    LocationHistory::create([
        'user_id' => $location->user_id,
        'latitude' => $location->latitude,
        'longitude' => $location->longitude,
        'address' => $location->address,
        'incident_type' => $location->incident_type,
        'timestamp' => $location->timestamp,
        'device_id' => $location->device_id ?? null,
    ]);
}

echo "Migrated " . count($mysqlLocations) . " location records";
```

Press Enter. Done! ✅

---

## PART 9: UPDATE .env FILES

### Update `.env` (Local Development)

```env
APP_NAME=ALMKA
APP_ENV=local
APP_DEBUG=true
APP_KEY=base64:B8H9LQlwTpEdg0RwG7/qLX96pVQoYGC0qd64vGuuPPg=
APP_URL=http://localhost:8000

LOG_CHANNEL=stack
LOG_LEVEL=debug

# MongoDB Local
DB_CONNECTION=mongodb
DB_HOST=127.0.0.1
DB_PORT=27017
DB_DATABASE=almka_blind
DB_USERNAME=
DB_PASSWORD=

CACHE_STORE=database
SESSION_DRIVER=database
QUEUE_CONNECTION=database
```

### Update `.env.example` (Template for Production)

```env
APP_NAME=ALMKA
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://almka-blind.onrender.com

LOG_CHANNEL=stack
LOG_LEVEL=debug

# MongoDB Atlas (for production/Render)
DB_CONNECTION=mongodb
DB_HOST=your-cluster.mongodb.net
DB_PORT=27017
DB_DATABASE=almka_blind
DB_USERNAME=your-username
DB_PASSWORD=your-password

CACHE_STORE=database
SESSION_DRIVER=database
QUEUE_CONNECTION=database
FILESYSTEM_DISK=local
```

---

## PART 10: CREATE MONGODB ATLAS (FOR RENDER)

### Step 1: Create MongoDB Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas
2. Click **"Try Free"**
3. Create account with:
   - Email: Your email
   - Password: Strong password
   - Organization: ALMKA
4. Click **"Create"**

### Step 2: Create Free Cluster

1. Click **"Build a Database"**
2. Choose **"Free"** tier
3. Cloud provider: **AWS**
4. Region: **US-East (N. Virginia)** or your region
5. Click **"Create"**
6. Wait ~3-5 minutes

### Step 3: Create Database User

1. Click **"Security"** → **"Database Access"**
2. Click **"Add New Database User"**
3. Fill:
   - **Username:** `almka_user`
   - **Password:** Generate strong password (save it!)
   - **Built-in Role:** `Atlas admin`
4. Click **"Add User"**

### Step 4: Allow Network Access

1. Click **"Network Access"**
2. Click **"Add IP Address"**
3. Choose **"Allow access from anywhere"** (for development)
4. Click **"Confirm"**

### Step 5: Get Connection String

1. Go back to **"Clusters"**
2. Click **"Connect"**
3. Choose **"Drivers"**
4. Select **"Node.js"** and version
5. Copy the connection string:

```
mongodb+srv://almka_user:PASSWORD@cluster.mongodb.net/almka_blind?retryWrites=true&w=majority&appName=ALMKA
```

Replace `PASSWORD` with your password!

---

## PART 11: DEPLOY TO RENDER WITH MONGODB

### Update `.env.example` for Render

```env
APP_NAME=ALMKA
APP_ENV=production
APP_DEBUG=false
APP_KEY=
APP_URL=https://almka-blind.onrender.com

LOG_CHANNEL=stack
DB_CONNECTION=mongodb
DB_HOST=your-cluster.mongodb.net
DB_PORT=27017
DB_DATABASE=almka_blind
DB_USERNAME=
DB_PASSWORD=
```

### Add to Render Environment Variables

1. Go to Render dashboard
2. Click your Web Service
3. Click **"Environment"**
4. Add:

```
APP_NAME=ALMKA
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:[YOUR_KEY]
APP_URL=https://almka-blind.onrender.com
LOG_CHANNEL=stack
DB_CONNECTION=mongodb
DB_HOST=your-cluster.mongodb.net
DB_PORT=27017
DB_DATABASE=almka_blind
DB_USERNAME=almka_user
DB_PASSWORD=[YOUR_PASSWORD_FROM_ATLAS]
CACHE_STORE=database
SESSION_DRIVER=database
QUEUE_CONNECTION=database
FILESYSTEM_DISK=local
VITE_API_BASE_URL=/api
```

### Update Build/Start Commands

**Build:**
```bash
composer install --no-dev && npm install && npm run build
```

**Start:**
```bash
php artisan migrate --force && php artisan serve --host 0.0.0.0 --port $PORT
```

---

## PART 12: MONGODB QUERY EXAMPLES

### Find Documents

```php
// Find all locations
$locations = LocationHistory::all();

// Find by user_id
$locations = LocationHistory::where('user_id', 1)->get();

// Find with multiple conditions
$locations = LocationHistory::where('user_id', 1)
    ->where('timestamp', '>=', now()->subDays(7))
    ->get();

// Find with sorting
$locations = LocationHistory::orderBy('timestamp', 'desc')->take(10)->get();
```

### Insert Documents

```php
// Create single document
LocationHistory::create([
    'user_id' => 1,
    'latitude' => 40.7128,
    'longitude' => -74.0060,
    'address' => 'New York, NY',
    'timestamp' => now(),
]);

// Insert many documents
$data = [
    ['user_id' => 1, 'latitude' => 40.7128, ...],
    ['user_id' => 1, 'latitude' => 40.7200, ...],
];
LocationHistory::insert($data);
```

### Update Documents

```php
// Update single document
$location = LocationHistory::find($id);
$location->update(['address' => 'New Address']);

// Update multiple
LocationHistory::where('user_id', 1)
    ->update(['address' => 'Updated']);
```

### Delete Documents

```php
// Delete single
LocationHistory::find($id)->delete();

// Delete multiple
LocationHistory::where('user_id', 1)->delete();
```

---

## PART 13: COMMON MONGODB OPERATIONS

### Create Indexes

```php
// In migration or artisan tinker
DB::connection('mongodb')
    ->collection('location_histories')
    ->createIndex(['user_id' => 1, 'timestamp' => -1]);
```

### Drop Collections

```bash
php artisan tinker
>>> DB::connection('mongodb')->collection('location_histories')->drop();
```

### Count Documents

```php
$count = LocationHistory::count();
$count = LocationHistory::where('user_id', 1)->count();
```

### Aggregation

```php
$results = LocationHistory::raw(function($collection) {
    return $collection->aggregate([
        ['$match' => ['user_id' => 1]],
        ['$group' => ['_id' => '$user_id', 'count' => ['$sum' => 1]]],
    ]);
});
```

---

## PART 14: TROUBLESHOOTING MONGODB

### ❌ Problem: "MongoDB service not running"

**Solution:**

```powershell
# Start MongoDB service
Start-Service MongoDB

# Verify it's running
Get-Service MongoDB
```

### ❌ Problem: "Cannot connect to MongoDB"

**Solution:**

1. Check MongoDB is running: `Get-Service MongoDB`
2. Check connection string: should be `mongodb://localhost:27017`
3. Try in mongosh: `mongosh`

### ❌ Problem: "Connection refused on port 27017"

**Solution:**

```powershell
# MongoDB default port is 27017
# Make sure it's not blocked by firewall
# Or change port in config/database.php
```

### ❌ Problem: "Authentication failed"

**Solution (Local):**
```env
# Local - no credentials needed
DB_USERNAME=
DB_PASSWORD=
```

**Solution (Atlas):**
```env
# Must include credentials
DB_USERNAME=almka_user
DB_PASSWORD=YourSecurePassword123
```

### ❌ Problem: "No migration file found"

**Solution:**

```bash
# Create migration
php artisan make:migration create_collections

# Then edit the file and add your MongoDB setup
```

### ❌ Problem: "Model not using MongoDB"

**Check:**
```php
// Must have this
use MongoDB\Laravel\Eloquent\Model;

// And this in model
protected $connection = 'mongodb';
protected $collection = 'collection_name';
```

---

## PART 15: QUICK REFERENCE

### Local Development Setup

```bash
# 1. Install MongoDB driver
composer require jenssegers/mongodb

# 2. Update .env
DB_CONNECTION=mongodb
DB_HOST=127.0.0.1
DB_PORT=27017

# 3. Create migrations
php artisan make:migration create_collections

# 4. Run migrations
php artisan migrate

# 5. Start servers
php artisan serve      # Terminal 1
npm run dev           # Terminal 2 (Vite)

# 6. Visit http://localhost:8000
```

### MongoDB Atlas Setup (Production)

```bash
# 1. Go to https://www.mongodb.com/cloud/atlas
# 2. Create free cluster
# 3. Create database user
# 4. Get connection string
# 5. Add to Render environment variables
# 6. Deploy!
```

### Model Checklist

Every MongoDB model needs:

```php
use MongoDB\Laravel\Eloquent\Model;

class YourModel extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'your_collection_name';
    protected $fillable = ['field1', 'field2'];
}
```

---

## PART 16: AFTER MIGRATION

### Verify Everything Works

```bash
# 1. Open browser
# Visit: http://localhost:8000

# 2. Test login/data fetch
# Should work same as before

# 3. Check MongoDB Compass
# Should see data in collections

# 4. Check logs for errors
# tail -f storage/logs/laravel.log
```

### Backup MySQL Data (Optional)

```bash
# Export MySQL data before deleting
mysqldump -u root almka_blind > almka_backup.sql

# Keep this file safe!
```

### Commit to Git

```bash
cd C:\xampp\htdocs\ALMKA_Blind

git add .
git commit -m "Migrate from MySQL to MongoDB"
git push origin main

# Render auto-deploys!
```

---

## 📚 DOCUMENTATION REFERENCES

- MongoDB Docs: https://docs.mongodb.com/
- Laravel MongoDB: https://github.com/jenssegers/laravel-mongodb
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- MongoDB Compass: https://www.mongodb.com/products/compass

---

**Congratulations! You've successfully migrated to MongoDB! 🎉**

Questions? Check Part 14 (Troubleshooting) or revisit the relevant section above.
