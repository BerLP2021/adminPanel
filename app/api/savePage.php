<?php
session_start();

if($_SESSION["auth"] != true) {
    header("HTTP/1.0 403 Forbidden");
    die;
}

$_POST = json_decode(file_get_contents("php://input"), true);

$file = $_POST["pageName"];
$descr = $_POST["descr"];
$html = $_POST["html"];

if(!is_dir("../backups/")) {
    mkdir("../backups/");
}

$backups = json_decode(file_get_contents("../backups/backups.json"));
if(!is_array($backups)) {
    $backups = [];
}

if ( $file && $html ) {
    $backupsFN = uniqid() . ".html";

    array_push($backups, ["pageName" => $file, "descr" => $descr, "file" => $backupsFN, "time" => date("H:i:s d:m:y")]);
    file_put_contents("../backups/backups.json", json_encode( $backups, JSON_PRETTY_PRINT ));
    file_put_contents("../../" . $file, $html);
    copy("../../" . $file, "../backups/" . $backupsFN);
} else {
    header("HTTP/1.0 400 Bad Request");
}