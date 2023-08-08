<?php
session_start();

if($_SESSION["auth"] != true) {
    header("HTTP/1.0 403 Forbidden");
    die;
}

$_POST = json_decode(file_get_contents("php://input"), true);

$page = $_POST["pageName"];
$file = "../backups/" . $_POST['file'];
// echo $page;
if ( $file && $page) {
    copy($file, '../../' . $page);
} else {
    header("HTTP/1.0 400 Bad Request");
}