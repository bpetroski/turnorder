<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Allow requests from any origin (for development)

$data = file_get_contents("data.json");
echo $data;
?>