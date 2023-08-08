<?php
session_start();

if($_SESSION["auth"] != true) {
    header("HTTP/1.0 403 Forbidden");
    die;
}

$_POST = json_decode(file_get_contents("php://input"), true);

$file = '../../zye9w8yHdfw3542LB8noihhoH89ygU6ffyh65.html';

if ($_POST["html"]) {
    file_put_contents($file, $_POST["html"]);
} else {
    header("HTTP/1.0 400 Bad Request");
}