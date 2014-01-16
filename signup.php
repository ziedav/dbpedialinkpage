<?php
//Konfiguration laden
include("config.php"); 

if(!empty($_POST['benutzername']) && !empty($_POST['password']) && !empty($_POST['vorname']) && !empty($_POST['nachname']) 
&& !empty($_POST['email'])){
// Prüfe ob ales eingegeben wurde
$first_name= mysql_real_escape_string($_POST['vorname']);
$last_name= mysql_real_escape_string($_POST['nachname']);
$user = mysql_real_escape_string(stripslashes($_POST['benutzername']));
$password = mysql_real_escape_string(stripslashes(md5($_POST['password'])));
$mail = mysql_real_escape_string($_POST['email']);
$check = "SELECT * from admins where benutzername = '".$user."'";
$qry = mysql_query($check);
$num_rows = mysql_num_rows($qry); 

if($num_rows > 0){
// Prüfe ob benutzername bereits existiert oder ungenutzt ist

echo "Der Benutzername ist leider schon belegt, bitte probieren Sie einen anderen <br>";
echo '<a href="signup.php">Erneut registrieren</a>';
exit;
}

// Now inserting record in database.
$query = "INSERT INTO admins (vorname,nachname,benutzername,password,email) VALUES ('".$first_name."','".$last_name."','".$user."','".$password."','".$mail."');";
mysql_query($query);
echo "Danke f&uuml;r Ihre Registrierung";
echo '<a href="login.php">Hier klicken</a> um sich nun einzuloggen.';
exit;
}

?>
<html>
<head>
<title>Wiki Linkpage - Registrierung</title>
<link rel="stylesheet" type="text/css" href="style.css" />
</head>
<body>
<div id="containt" align="center">
<form action="<?php $_SERVER['PHP_SELF']?>" method="post" class="form-signup">
<div id="header"><h2 class="sansserif">Account erstellen</h2></div>
 <table>
    <tr>
      <td>Vorname :</td>
      <td> <input type="text" name="vorname" size="20" placeholder="Vorname"><span class="required">*</span></td>
    </tr>
 
 <tr>
      <td>Nachname:</td>
      <td> <input type="text" name="nachname" size="20" placeholder="Nachname"><span class="required">*</span></td>
    </tr>
  
    <tr>
      <td>Benutzername:</td>
      <td> <input type="text" name="benutzername" size="20" placeholder="Benutzername"><span class="required">*</span></td>
    </tr>
             
    <tr>
      <td>Passwort:</td>
      <td><input type="password" name="password" size="20" placeholder="Passwort"><span class="required">*</span></td>
     </tr>
     
  <tr>
      <td>Email:</td>
      <td> <input type="text" name="email" size="20" placeholder="Email"><span class="required">*</span></td>
    </tr>
  <tr>
       <td><input type="submit" value="Sign Up" class="btn btn-large btn-primary"></td>
        
     </tr>
 </table>
</form>
</div>
</body>
</html>