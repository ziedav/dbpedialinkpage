<!DOCTYPE html>
<?php
    define('__ROOT__', dirname(__FILE__));
?>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <title>Wikipedia Lookup</title>
        <link rel="stylesheet" type="text/css" href="css/style.css"></link>
        <script type="text/javascript" src="js/jquery-1.10.1.min.js"></script>
        <script type="text/javascript" src="js/core.js"></script>
        <script type="text/javascript" src="js/linkage.js"></script>
        <script type="text/javascript" src="js/ajax-requests.js"></script>
		<script type="text/javascript">
			var database = new Database();
			jQuery(document).ready(function(){
				database.listen_show_common_words();
				database.listen_show_active_users();
				database.listen_show_most_viewed_url();
				database.listen_show_users_last_url(logged_user);
			   });
		</script>
    </head>
    <body>
    <?php
        include_once (__ROOT__.'\view.php');
    ?>
    </body>
</html>