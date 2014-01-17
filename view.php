<link rel="stylesheet" type="text/css" href="css/style.css" />
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
<footer>Web Technologien - Mini Projekt Linkpage - WS 13/14  <a href="login.html" >.</a></footer>
<script type="text/javascript">

    var linker = new WikiLink('#test','#linked_text');
    
    jQuery(document).ready(function(){
        linker.listen();
    });
</script>
