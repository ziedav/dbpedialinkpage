<?php 
if(isset($_POST) && !empty($_POST))
{
session_start();
include("config_login.php");
$username = mysql_real_escape_string(stripslashes($_POST['username']));
$password = mysql_real_escape_string(stripslashes(md5($_POST['password'])));


$match = "SELECT * FROM $table WHERE benutzer = '".$username."' AND passwort = '".$password."' AND isAdmin=1;"; 

$qry = mysql_query($match);

$num_rows = mysql_num_rows($qry); 

if ($num_rows <= 0) { 

echo "Sorry, es gibt leider keinen Admin $username mit dem eingegebenen Passwort.";

echo "Bitte erneut probieren";

exit; 

} else {

$_SESSION['user']= $_POST["username"];
//Redirect page
header("location:admin_area.php");
}
}else{
?>
<html>
<head>
<title>Wiki Linkpage - Login</title>
<link rel="stylesheet" type="text/css" href="style.css" />
</head>
<body>
 <div class="container login">
<form action="<?php $_SERVER['PHP_SELF'] ?>" method="post" class="form-signin" id = "login_form" >
<h2 class="form-signin-heading">Admin Login</h2>
<input type="text" name="username" size="20" placeholder="Benutzername">
<input type="password" name="password" size="20" placeholder="Password"></br>
<input type="submit" value="Log In" class="btn btn-large btn-primary">
<a href="signup.php">Neu Registrieren</a>        
</form>
</div>
</body>
</html>
<?php
}
?>