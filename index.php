<!DOCTYPE html>
<?php
    define('__ROOT__', dirname(__FILE__));
?>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <title>Wikipedia Lookup</title>
        <link rel="stylesheet" type="text/css" href="css/style.css"></link>
        <script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
        <script type="text/javascript" src="js/core.js"></script>
        <script type="text/javascript" src="js/linkage.js"></script>
    </head>
    <body>
    <?php
        include_once (__ROOT__.'\view.php'); 
    ?>
    </body>
</html>