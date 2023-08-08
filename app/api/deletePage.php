<?php
session_start();

if($_SESSION["auth"] != true) {
    header("HTTP/1.0 403 Forbidden");
    die;
}

$_POST = json_decode(file_get_contents("php://input"), true);

$fileToDelete = '../backups/' . $_POST['file'];
// echo $fileToDelete;
$fileNameToDelete = $_POST['file'];
$backupsFile = '../backups/backups.json';

if (file_exists($fileToDelete)) {
    unlink($fileToDelete);
    
    $backups = json_decode(file_get_contents($backupsFile), true);

    foreach ($backups as $key => $item) {
        if ($item['file'] === $fileNameToDelete) {
            unset($backups[$key]);
        }
    }

    file_put_contents($backupsFile, json_encode($backups, JSON_PRETTY_PRINT));
} else {
    header("HTTP/1.0 400 Bad Request");
}