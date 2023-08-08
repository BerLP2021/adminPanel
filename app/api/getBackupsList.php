<?php
session_start();

if($_SESSION["auth"] != true) {
    header("HTTP/1.0 403 Forbidden");
    die;
}

if(!is_dir("../backups/")) {
    mkdir("../backups/");
}

$backups = "../backups/backups.json";
if(!file_exists($backups)) {
    $jsonData = json_encode([], JSON_PRETTY_PRINT);
    file_put_contents($backups, $jsonData);
    echo $jsonData;
    die;
} 

// echo file_get_contents($backups);
$data = json_decode(file_get_contents($backups), true);

echo json_encode($data, JSON_PRETTY_PRINT);