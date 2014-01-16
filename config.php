<?php
$database = "linkpage";  // the name of the database.
$server = "localhost";  // server to connect to.
$db_user = "root";  // mysql username to access the database with.
$db_pass = "";  // mysql password to access the database with.
$table = "admins";    // the table that this script will set up and use.
$link = mysql_connect($server, $db_user, $db_pass);
mysql_select_db($database,$link);
?>