<?php
// echo json_encode($_POST["fileName"]);
$_POST = json_decode(file_get_contents("php://input"), true);

$newFile = '../../'.$_POST["fileName"].'.html';

if ($_POST["fileName"] && file_exists($newFile)) {
    header("HTTP/1.0 400 Bad Request");
} else {
    fopen($newFile, 'w');
}