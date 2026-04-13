<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$videos = DB::table('video_recordings')->orderBy('created_at', 'desc')->limit(5)->get();
echo "Video Recordings:\n";
foreach($videos as $v) {
    echo "- ID: {$v->id}, Title: {$v->title}, Duration: {$v->duration_seconds}s, Time: {$v->created_at}\n";
}
?>
