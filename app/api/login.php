<?php
session_start();
$_POST = json_decode(file_get_contents("php://input"), true);

$pass = $_POST["password"];

if($pass) {
    $settings = json_decode(file_get_contents("./settings.json"), true);
    if($pass == $settings["password"]) {
        $_SESSION["auth"] = true;
        echo json_encode(array("auth" => true));
    } else {
        $_SESSION["auth"] = false;
        echo json_encode(array("auth" => false));
    }
} else {
    header("HTTP/1.0 400 Bad Request");
}