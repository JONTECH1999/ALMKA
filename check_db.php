<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$count = DB::table('location_histories')->count();
echo "Location records: $count\n";

$records = DB::table('location_histories')->orderBy('created_at', 'desc')->limit(5)->get();
echo "Recent records:\n";
foreach ($records as $record) {
    echo "- ID: {$record->id}, Lat: {$record->latitude}, Lng: {$record->longitude}, Address: {$record->address}, Time: {$record->created_at}\n";
}
?>