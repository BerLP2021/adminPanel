<?php
session_start();

if($_SESSION["auth"] != true) {
    header("HTTP/1.0 403 Forbidden");
    die;
}

$tempFile = $_FILES['image']['tmp_name'];

if(file_exists($tempFile) && is_uploaded_file($tempFile)) {
    $extension = explode('/', $_FILES['image']['type'])[1];
   
    if(!is_dir("../../imgh/")) {
        mkdir("../../imgh/");
    }
    //    Alternative way
    // $tempFilePath = $_FILES['image']['name'];
    // $extension = pathinfo($tempFilePath, PATHINFO_EXTENSION);
    // $extension = strtolower($extension);

    $fileName =  uniqid() . '.' . $extension;
    $filePath = '../../imgh/' . $fileName;
    move_uploaded_file($tempFile, $filePath);

    echo $filePath;
}

