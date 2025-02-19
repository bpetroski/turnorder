<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Allow requests from any origin (for development)
header("Access-Control-Allow-Methods: POST"); // Allow POST requests
header("Access-Control-Allow-Headers: Content-Type"); // Allow Content-Type header

// Get the raw POST data
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Debugging: Log the received data
error_log("Received data: " . print_r($data, true));

$name = $data["name"] ?? "";

if (empty($name)) {
  echo json_encode(["success" => false, "message" => "Name is required"]);
  exit;
}

// Load existing data
$fileData = file_get_contents("data.json");
$jsonData = json_decode($fileData, true);

// Check if the representative already exists
if (in_array($name, $jsonData["representatives"])) {
  echo json_encode(["success" => false, "message" => "Representative already exists"]);
  exit;
}

// Add the new representative
$jsonData["representatives"][] = $name;
$jsonData["customerCount"][$name] = 0;

// Save the updated data
file_put_contents("data.json", json_encode($jsonData));

echo json_encode(["success" => true]);
?>