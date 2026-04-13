<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo 'Current URL: ' . url('/') . PHP_EOL;
echo 'Storage URL: ' . url('storage/video-recordings/test.mp4') . PHP_EOL;
echo 'Request URL: ' . request()->getSchemeAndHttpHost() . PHP_EOL;
?>