<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Simulate a request to get the correct base URL
$request = new Illuminate\Http\Request();
$request->server->set('HTTP_HOST', 'localhost:8000');
$request->server->set('HTTPS', 'off');

$app->instance('request', $request);

$videos = DB::table('video_recordings')->get();
echo "Updating video URLs...\n";

foreach($videos as $video) {
    $baseUrl = 'http://localhost:8000'; // Hardcode for now since we're running on port 8000
    $newUrl = $baseUrl . '/storage/' . $video->file_path;
    DB::table('video_recordings')
        ->where('id', $video->id)
        ->update(['video_url' => $newUrl]);
    
    echo "Updated ID {$video->id}: {$newUrl}\n";
}

echo "All video URLs updated!\n";
?>