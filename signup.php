<?php
//Konfiguration laden
include("config_login.php"); 

if(!empty($_POST['vorname']) && !empty($_POST['nachname']) && !empty($_POST['benutzer']) && !empty($_POST['password']) 
&& !empty($_POST['email'])){
// Prüfe ob ales eingegeben wurde
$first_name= mysql_real_escape_string($_POST['vorname']);
$last_name= mysql_real_escape_string($_POST['nachname']);
$user = mysql_real_escape_string(stripslashes($_POST['benutzer']));
$password = mysql_real_escape_string(stripslashes(md5($_POST['password'])));
$mail = mysql_real_escape_string($_POST['email']);
$check = "SELECT * from personen where benutzer = '".$user."'";
$qry = mysql_query($check);
$num_rows = mysql_num_rows($qry); 

if($num_rows > 0){
// Prüfe ob benutzername bereits existiert oder ungenutzt ist

echo "Der Benutzername ist leider schon belegt, bitte probieren Sie einen anderen <br>";
echo '<a href="signup.php">Erneut registrieren</a>';
exit;
}

// Now inserting record in database.
$query = "INSERT INTO personen (vorname,nachname,benutzer,passwort,email,createDate) VALUES ('".$first_name."','".$last_name."','".$user."','".$password."','".$mail."',NOW());";
mysql_query($query);
echo "Danke f&uuml;r Ihre Registrierung<br/>";
echo '<a href="index.php">Hier klicken </a> um zur Startseite zur&uuml;ckzugehen';
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
      <td> <input type="text" name="benutzer" size="20" placeholder="Benutzername"><span class="required">*</span></td>
    </tr>
             
    <tr>
      <td>Passwort:</td>
      <td><input type="password" name="password" size="20" placeholder="Passwort"><span class="required">*</span></td>
     </tr>
     
  <tr>
      <td>Email:</td>
      <td> <input type="email" name="email" size="20" placeholder="Email"><span class="required">*</span></td>
    </tr>
  <tr>
       <td><input type="submit" value="Sign Up" class="btn btn-large btn-primary"></td>
        
     </tr>
 </table>
</form>
</div>
</body>
</html>