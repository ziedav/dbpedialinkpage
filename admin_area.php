<html>
<head>
	<title>Admin Bereich</title>
	<script src="js/jquery-1.10.1.min.js"></script>
	<script type="text/javascript" src="js/core.js"></script>
	<script type="text/javascript" src="js/linkage.js"></script>
    <script type="text/javascript" src="js/ajax-requests.js"></script>
	
	<script type="text/javascript">
    var database = new Database();
    jQuery(document).ready(function(){
        database.listen_word_activate();
		database.listen_word_deactivate();
		database.listen_admin_activate();
		database.listen_user_delete();
		database.listen_show_common_words();
		database.listen_show_active_users();
    });
	</script>
</head>
<body>
<?php
session_start();
if(isset($_SESSION['user']) && !empty($_SESSION['user'])){
 echo "Willkommen ". $_SESSION['user'];
?>
<br/>
<a href = "index.php">Logout</a> 
<?php 
}else{
 header("location:admin_login.php");
}
?>

<h1 align="center">Admin-Bereich</h1>
<table>
	<tr>
		<td>Wort aktivieren:</td>
		<td><input type="text" id="word_activate" size="20" placeholder="Wort eingeben"></input></td>
		<td><button id="word_active_run">Ausf&uuml;hren</button></td>
		<td></td>
	</tr>
	<tr>
		<td>Wort deaktivieren:</td>
		<td><input type="text" id="word_deactivate" size="20" placeholder="Wort eingeben"></input></td>
		<td><button id="word_deactive_run">Ausf&uuml;hren</button></td>
		<td></td>
	</tr>
	<tr>
		<td>Admin aktivieren:</td>
		<td><input type="text" id="admin_activate" size="20" placeholder="Benutzername eingeben"></input></td>
		<td><button id="admin_activate_run">Ausf&uuml;hren</button></td>
		<td></td>
	</tr>
	<tr>
		<td>User l&ouml;schen:</td>
		<td><input type="text" id="user_delete" size="20" placeholder="Benutzername eingeben"></input></td>
		<td><button id="user_delete_run">Ausf&uuml;hren</button></td>
		<td></td>
	</tr>
</table>
<button id="show_common_words_run">Die h&auml;ufigsten W&ouml;rter anzeigen lassen</button>
<button id="show_active_users_run">Die aktivsten Nutzer anzeigen lassen</button>
<div id="common_words"></div>
</body>