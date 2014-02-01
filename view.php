<?php 
if(isset($_POST) && !empty($_POST))
{
session_start();
include("config_login.php");
$username = mysql_real_escape_string(stripslashes($_POST['username']));
$password = mysql_real_escape_string(stripslashes(md5($_POST['password'])));


$match = "SELECT * FROM $table WHERE benutzer = '".$username."' AND passwort = '".$password."'"; 

$qry = mysql_query($match);

$num_rows = mysql_num_rows($qry); 

if ($num_rows <= 0) { 

echo "Sorry, es gibt leider keinen User $username mit dem eingegebenen Passwort.";

echo "Bitte erneut probieren";

exit; 

} else {

$_SESSION['user']= $_POST["username"];
//Redirect page
header("location:index.php");
}
}
?>



<div id="content">
    <h1>Wikipedia Linkpage</h1>

         <img src="img/logo_uni.png"
         alt="Universit&auml;t des Saarlandes" style="height: 123px; width: 317px" >      <img 
            alt="Wiki" src="img/Wikipedia.png" style="width: 131px; height: 144px" />
	<h2>Geben Sie den zu verlinkenden Text/URL ein:</h2>
    <table> 
    <tr>
        <td>
            <textarea style = "resize: none;" rows="20" cols="60" id="url_input" name="url_input"></textarea><br/>
        </td>
        <td>
            <div id="linked_text" style=" background-color:#808080;  filter:alpha(opacity=70);opacity:0.7"></div>
        </td>
    </tr>
    <tr>
        <td>
			<button id="crawl_by_url">1.Link aufbereiten</button>
			<button id="validate_text">2.Text aufbereiten</button>
        </td>
        <td>
            <div class="fsb">
                <div class="fortschritt" id ="prg_bar"></div>
            </div>
            <p><b id="prg_status_percent">0</b>/100 (%)</p>
        </td>
    </tr>
    </table>
</div>
<!--Logged in?-->
<?php
session_start();
if(isset($_SESSION['user']) && !empty($_SESSION['user'])){
 echo "Willkommen ". $_SESSION['user'] . "  ";
?>
<script type="text/javascript">
   var java_user = "<?php echo $_SESSION['user']; ?>";
</script>
<a href = "logout.php">Logout</a> 
<br/>
<br/>

<button id="show_users_last_url_run">Meine letzten Anfragen anzeigen lassen</button>
<button id="show_common_words_run">Die h&auml;ufigsten W&ouml;rter anzeigen lassen</button>
<button id="show_active_users_run">Die aktivsten Nutzer anzeigen lassen</button>
<button id="show_most_viewed_url_run">Meist betrachteten Internetseiten anzeigen lassen</button>
<div id="common_words"></div>
<br/>
<br/>

<?php 
}else{
?>


<form action="<?php $_SERVER['PHP_SELF'] ?>" method="post" class="form-signin" id = "login_form" >
<input type="text" name="username" size="20" placeholder="Benutzername">
<input type="password" name="password" size="20" placeholder="Password"></br>
<input type="submit" value="Log In" class="btn btn-large btn-primary">
<a href="signup.php">Neu Registrieren</a>        
</form>

<?php
}
?>
<footer>Web Technologien - Mini Projekt Linkpage - WS 13/14 </footer>
<script type="text/javascript">
    var linker = new WikiLink('#url_input','#linked_text');
	//Prüfe ob User eingeloggt ist und setze Variable dementsprechend
	var logged_user = "<?php 
		if(isset($_SESSION['user']) && !empty($_SESSION['user'])){
			echo $_SESSION['user']; 
		}
		else {
			echo 'NULL';
		}
		
	?>";
    
    var wikiBox = ViewFactory('list', 'wiki_box', 'ul');
    //var crawler = new Crawler('input#url_input', 'button#crawl_by_url', '#test');
    var crawler = new Crawler('#url_input', 'button#crawl_by_url', '#url_input', logged_user);
    var editor = new Editor('#url_input');
    
    jQuery(document).ready(function(){
        linker.listen();
        //wiki_box listeners on development
        wikiBox.bindTo(jQuery('.wiki_box_destiny'), 'append');
        var wikiBoxInput = jQuery('input#wiki_box_input');
        
        wikiBoxInput.change(function(){
            linker.openSearch(wikiBoxInput.val(), 'linker.pushOpenSearchToWikiBox');
        });
        //wiki_box end
        crawler.listen();
        editor.listen();
    });
</script>
