<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$videos = DB::table('video_recordings')->orderBy('created_at', 'desc')->limit(3)->get();
echo "Video Recordings:\n";
foreach($videos as $v) {
    echo "ID: {$v->id}, URL: {$v->video_url}, File: {$v->file_path}\n";
    // Check if file exists
    $fullPath = storage_path('app/public/' . $v->file_path);
    echo "File exists: " . (file_exists($fullPath) ? 'YES' : 'NO') . "\n";
    echo "---\n";
}
?>