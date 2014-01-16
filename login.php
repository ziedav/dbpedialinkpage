<?php
$username = $_post["username"];
$password = $_POST["password"];
$valid = 0;

$admins = fopen ("admins.txt","r");

while (!feof($admins)) {
		$row = fgets($admins,20);
		$data = explode("|", $row);
	if ($data[0] == $username and $passowrd== trim($data[1])) {$valid =1; }
	}
fclose $admins;
if ($valid == 0) { echo "nice try" }
?>