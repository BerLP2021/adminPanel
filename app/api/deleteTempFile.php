<?php
session_start();

if($_SESSION["auth"] != true) {
    header("HTTP/1.0 403 Forbidden");
    die;
}

$file = '../../zye9w8yHdfw3542LB8noihhoH89ygU6ffyh65.html';

if (file_exists($file)) {
    unlink($file);
} else {
    header("HTTP/1.0 400 Bad Request");
}