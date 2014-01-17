<link rel="stylesheet" type="text/css" href="css/style.css" />
<div id="content">
    <h1>Wikipedia Linkpage</h1>
    <a href="http://www.wikipedia.de" target="_blank">	 		
        <img src="img/wikipedialogo.png" alt="Wikipedia Logo" >
    </a>
    <h2>Geben Sie den zu verlinkenden Text ein:</h2>
    <table> 
    <tr>
        <td>
            <textarea style = "resize: none;" rows="20" cols="60" id="test" name="test"></textarea><br/>
        </td>
        <td>
            <div id="linked_text"></div>
        </td>
    </tr>
    <tr>
        <td>
            <button id="validate_text">Text aufbereiten mit Wiki</button>
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
<div class="wiki_box_destiny">
    <div>Open-Search</div>
    <input type="text" id="wiki_box_input"></input>
</div>
<footer>Web Technologien - Mini Projekt Linkpage - WS 13/14  <a href="login.html" >.</a></footer>
<script type="text/javascript">

    var linker = new WikiLink('#test','#linked_text');
    var wikiBox = ViewFactory('list', 'wiki_box', 'ul'); 
    console.log(wikiBox);
    jQuery(document).ready(function(){
        linker.listen();
        
        //wiki_box on development
        wikiBox.bindTo(jQuery('.wiki_box_destiny'), 'append');
        var wikiBoxInput = jQuery('input#wiki_box_input');
        
        wikiBoxInput.change(function(){
            linker.openSearch(wikiBoxInput.val(), 'linker.pushOpenSearchToWikiBox');
        });
    });
</script>
