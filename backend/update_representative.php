<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Allow requests from any origin (for development)
header("Access-Control-Allow-Methods: POST"); // Allow POST requests
header("Access-Control-Allow-Headers: Content-Type"); // Allow Content-Type header

// Get the raw POST data
$input = file_get_contents("php://input");
$data = json_decode($input, true);

$updatedRepresentatives = $data["updatedRepresentatives"] ?? [];
$updatedCustomerCount = $data["updatedCustomerCount"] ?? [];
$currentlyWorking = $data["currentlyWorking"] ?? [];

if (empty($updatedRepresentatives) || empty($updatedCustomerCount)) {
  echo json_encode(["success" => false, "message" => "Invalid data"]);
  exit;
}

// Save the updated data
$filePath = __DIR__ . "/data.json"; // Ensure the file path is correct
$fileData = json_encode([
  "representatives" => $updatedRepresentatives,
  "customerCount" => $updatedCustomerCount,
  "currentlyWorking" => $currentlyWorking
], JSON_PRETTY_PRINT);

if (file_put_contents($filePath, $fileData) === false) {
  $error = error_get_last();
  echo json_encode(["success" => false, "message" => "Failed to write to file", "error" => $error]);
  error_log("Failed to write to $filePath: " . $error['message']);
  exit;
}

echo json_encode(["success" => true]);
?>