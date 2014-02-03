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
    <div id="wiki_leaks">
        <h1>Wikipedia Linkpage</h1>
        <img src="img/logo_uni.png" alt="Universit&auml;t des Saarlandes" style="height: 123px; width: 317px" >      
        <img alt="Wiki" src="img/Wikipedia.png" style="width: 131px; height: 144px" />
        <h2>Geben Sie den zu verlinkenden Text/URL ein:</h2>
        <div id="content_wiki_leaks">
            <div id="fake_url_title">Bitte, hier die Url bitte angeben!</div>
            <input type="text" id="url_input">
            <button id="crawl_by_url">Seite anfragen</button>
            <button id="text_input">Text einfügen</button>
            <button id="validate_text">verlinken</button>
            <textarea style = "resize: none;" id="text_input" name="url_input"></textarea>
            <div id="linked_text" style=" background-color:#808080;  filter:alpha(opacity=70);opacity:0.7"></div>
            <div id="preview_footer">
            <div class="fsb">
                <div class="fortschritt" id ="prg_bar"></div>
            </div>
            <p><b>/100 (%)</b><b id="prg_status_percent">0</b></p>
            <p id="page_state">
                <b>Seiten</b>
                <b id="page_numbers">0</b>
                <b>Seite von insgesamt</b>
                <b id="page_number">0</b>
            </p>
            </div>
            <div id="page_navigation">
                <input type="button" id="back" value="zurück">
                <input type="button" id="next" value="weiter">
            </div>
        </div>
     </div>
    <div class="wiki_box_destiny">
        <div id="fake_title">Open-Search</div>
        <input type="text" id="wiki_box_input" class="nice_background"></input>
    </div>   
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
    var linker = new WikiLink('#linked_text', '#linked_text');
    var editor = new Editor('#linked_text');
    
    jQuery(document).ready(function(){
        linker.listen();
        editor.listen();
        //wiki_box listeners on development
        wikiBox.bindTo(jQuery('.wiki_box_destiny'), 'append');
        var wikiBoxInput = jQuery('input#wiki_box_input');
        
        wikiBoxInput.change(function(){
            linker.openSearch(wikiBoxInput.val(), 'linker.pushOpenSearchToWikiBox');
        });
        //wiki_box end
        //text einfügen
        var textInput = jQuery('textarea#text_input');
        var linkedText = jQuery('#linked_text');
        jQuery('button#text_input').click(function(){
            linkedText.hide();
            textInput.val('');
            textInput.show();
            textInput.focus();
        });
        
        textInput.mouseout(function(){
            linkedText.html('<p>'+textInput.val()+'</p>');
            textInput.hide();
            linkedText.show();
        });
        
        //fakers temporary not factorizied
        var fakeTitle = jQuery('#fake_title');
        var wikiBoxInput = jQuery('#wiki_box_input');
        if(wikiBoxInput.val() !== ''){
            fakeTitle.hide();
        }
        fakeTitle.click(function(){
            fakeTitle.hide();
            wikiBoxInput.focus();
        });
        
        wikiBoxInput.bind('change blur', function(){
            if(wikiBoxInput.val() === ''){
                fakeTitle.show();
            }
        });
        
        var fakeTitleLink = jQuery('#fake_url_title');
        var urlInput = jQuery('#url_input');
        if(urlInput.val() !== ''){
            fakeTitleLink.hide();
        }
        fakeTitleLink.click(function(){
            fakeTitleLink.hide();
            urlInput.focus();
        });
        
        urlInput.bind('change blur', function(){
            if(urlInput.val() === ''){
                fakeTitleLink.show();
            }
        });
    });
</script>
