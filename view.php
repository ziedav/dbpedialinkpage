<script type="text/javascript">
    var searched='';
    var workingon='';
    var wikicheck = function (data) {
        //In data[0] liegt das angefragte Element
        //In data[1] liegt das Array mit den gefundenen Begriffen
        //console.log(data[1]);
        var found = false;
        var url='';
        //Ergebnis der Wikianfrage
        var text = data [0];
        //Hole die Eingabe
        //var input_text = document.getElementById ('spellcheckinput').value;
        var input_text = workingon;
        //Bereinige die Eingabe
        input_text = input_text.replace(/\s/g, "");
        //console.log(input_text);

        //if (text != input_text)
        //	return;

        for (i=0; i<data [1].length; i++) {
            //Gehe die Ergebnisliste durch und prüfe ob das Wort genau übereinstimmt
            if (text.toLowerCase () == data [1] [i].toLowerCase ()) {
                found = true;
                //Pruefe ob erster Buchstabe groß ist, nur dann soll etwas passieren
                if (text.toLowerCase () != text) {
                    url ='http://de.wikipedia.org/wiki/' + text;
                    //document.getElementById ('spellcheckresult').innerHTML = '<b style="color:green">Begriff gefunden</b> - <a target="_new" href="' + url + '">' + text + '</a>';
                    document.getElementById ('resulttext').innerHTML = searched + '<a target="_new" href="' + url + '">' + text + '</a>';
                    searched = searched + '<a target="_new" href="' + url + '">' + text + '</a>' + ' ';
                }
                else {
                    //document.getElementById ('spellcheckresult').innerHTML = '<b style="color:red">Begriff nicht gefunden</b> - ' + text + '';
                    document.getElementById ('resulttext').innerHTML = searched + text + ' ';
                    searched = searched +  text + ' ';
                }
            }
        }
        //Wenn keines der Ergebnisse passt, dann füge den Text unformatiert wieder ein
        if (! found) {
            //document.getElementById ('spellcheckresult').innerHTML = '<b style="color:red">Begriff nicht gefunden</b> - ' + text + '';
            document.getElementById ('resulttext').innerHTML = searched + text + ' ';
            searched = searched +  text + ' ';
        }

        //Leere das Eingabefeld
        //document.getElementById ('spellcheckinput').value = '';
    };

    var checkavailability = function (value, callback) {
        if(typeof callback === 'undefined')
            callback = 'wikicheck';
        //console.log(value);
        //if (! value)
        //	return;
        //Entferne Leerzeichen
        value = value.replace(/\s/g, "");
        //Aktualisiere workingon
        workingon = value;

        url = 'http://de.wikipedia.org/w/api.php?action=opensearch&search='+value+'&format=json&callback='+callback;
        //Connect to wiki
        var elem = document.createElement ('script');
        elem.setAttribute ('src', url);
        elem.setAttribute ('type','text/javascript');
        document.getElementsByTagName ('head') [0].appendChild (elem);
        //console.log(document.getElementsByTagName ('head') [0]);
    };

    function sleep(miliseconds, status) {
        var currentTime = new Date().getTime();
        //document.getElementById ('statusbar').innerHTML = status;
        while (currentTime + miliseconds >= new Date().getTime()) {
        }
    };

    var splitstrings = function (stringinput) {
        if (!stringinput)
            return;
        var string_splitted = stringinput.split(" ");
        for (i=0; i<(string_splitted.length);i++) {
            checkavailability (string_splitted[i]);	
            var status = (i/string_splitted.length);
            sleep(0, status);
            //document.getElementById ('debug').innerHTML = string_splitted[i];
        }
    };  
</script>
<form action="#" method="get" onsubmit="return false">
<p>Geben Sie ein Wort ein: - 
	<input id="spellcheckinput" type="text"></input>
	<button name="Start_lookup" onclick="splitstrings (spellcheckinput.value);"><p>Start lookup</p></button>
	<span id="spellcheckresult"></span>
</p>
</form>
<span id="statusbar">0/100</span></br>
<span id="resulttext">Hier steht Text</span></br>
<textarea id="input_text" name="input_text" rows="5" cols="55" onclick="traverse(input_text.value);">Barack Obama</textarea>
<span id="debug"></span></br>
<textarea id="test" name="test" rows="5" cols="55">Hast du Barack Obama, Steve Jobs oder Bill Clinton schon mal getroffen?!</textarea>
<div id="linked_text"></div>
<button id="validate_text">validate</button>
<div>test commit</div>

