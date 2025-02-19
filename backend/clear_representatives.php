<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Allow requests from any origin (for development)
header("Access-Control-Allow-Methods: POST"); // Allow POST requests
header("Access-Control-Allow-Headers: Content-Type"); // Allow Content-Type header

// Reset data
$data = [
    "representatives" => [],
    "customerCount" => [],
    "currentlyWorking" => []
];

// Save the reset data
$filePath = __DIR__ . "/data.json"; // Ensure the file path is correct
$fileData = json_encode($data, JSON_PRETTY_PRINT);

if (file_put_contents($filePath, $fileData) === false) {
    $error = error_get_last();
    echo json_encode(["success" => false, "message" => "Failed to write to file", "error" => $error]);
    error_log("Failed to write to $filePath: " . $error['message']);
    exit;
}

echo json_encode(["success" => true]);
?>
