<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Test if storage directory exists
$storageDir = storage_path('app/public/video-recordings');
if (!is_dir($storageDir)) {
    mkdir($storageDir, 0755, true);
    echo "Created storage directory: $storageDir\n";
} else {
    echo "Storage directory exists: $storageDir\n";
}

// Test if we can create a file
$testFile = $storageDir . '/test.txt';
if (file_put_contents($testFile, 'test') !== false) {
    echo "Successfully created test file\n";
    unlink($testFile);
} else {
    echo "Failed to create test file\n";
}

// Test the API call
try {
    $response = json_decode(file_get_contents(
        "http://127.0.0.1:8000/api/logger/video/record",
        false,
        stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => 'Content-Type: application/json',
                'content' => json_encode(['duration' => 5, 'title' => 'Test'])
            ]
        ])
    ), true);
    
    echo "API Response: " . json_encode($response, JSON_PRETTY_PRINT) . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
