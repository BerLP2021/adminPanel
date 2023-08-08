<?php
session_start();

if($_SESSION["auth"] != true) {
    header("HTTP/1.0 403 Forbidden");
    die;
}

$files = glob('../../*.html');
$resData = [];

if (!empty($files)) {
    foreach ($files as $file) {
        array_push($resData, basename($file));
    }
} else {
    echo "Нет файлов, удовлетворяющих заданному шаблону.";
}
echo json_encode($resData);