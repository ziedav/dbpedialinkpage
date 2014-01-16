<?php 
if(isset($_POST) && !empty($_POST))
{
session_start();
include("config.php");
$username = mysql_real_escape_string(stripslashes($_POST['username']));
$password = mysql_real_escape_string(stripslashes(md5($_POST['password'])));


$match = "select id from $table where benutzername = '".$username."' and password = '".$password."';"; 

$qry = mysql_query($match);

$num_rows = mysql_num_rows($qry); 

if ($num_rows <= 0) { 

echo "Sorry, es gibt leider keinen Benutzername $username mit dem eingegebenen Passwort.";

echo "Bitte erneut probieren";

exit; 

} else {

$_SESSION['user']= $_POST["benutzername"];
header("location:home.php");
// It is the page where you want to redirect user after login.
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