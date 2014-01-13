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
<span id="debug"></span></br>
<textarea id="input_text" name="input_text" rows="5" cols="55" onclick="traverse(input_text.value);">Barack Obama</textarea></br>
<textarea id="test" name="test" rows="10" cols="80">Barack Obama Bill Clinton Angela Merkel
Der Untertitel des Buches „Der Implex“ von Barbara Kirchner und Dietmar
Dath1 heißt „Sozialer Fortschritt. Begriff und Geschichte“, handelt also von
Gesellschaftlichem. Bevor Soziologen, Politologen, Philosophen, Ökonomen
und Historiker sich damit befassen, sollten sie eine Warnung zur Kenntnis
nehmen, die gleich im ersten Satz steht. Sie lautet:
„Dieses Buch ist keine wissenschaftliche Monographie, kein Manifest, keine
philosophische Abhandlung.“
Das überrascht. Tatsächlich wird 835 Seiten lang über Gesellschaft, Politik,
Kunst, Philosophie räsoniert. Das Buch hat Anmerkungen, Literaturverzeich-
nis und Register wie ein wissenschaftliches Werk.
Dennoch werden Spezialistinnen und Spezialisten verschiedener Disziplinen
sich aufregen. Sie müssen den durchaus zutreffenden Eindruck gewinnen, als
seien die Erträge ihrer Fächer nur Material zu einem Zweck, der außerhalb
liegt. Ergebnisse werden abgegriffen, oft nur im Namedropping erwähnt, Lob
und Tadel werden verteilt, aber zuweilen im Detail nicht begründet. Hinterher
erscheinen die Fächer geplündert, und die Lieferanten fragen sich, was
schließlich daraus neu erstellt werden soll.
Kirchner und Dath antworten: „Man könnte sagen, dass das Buch eine Art
Roman in Begriffen ist: Es begleitet die Schicksale von Versuchen, die Welt
besser einzurichten, als die neuzeitlichen Menschen sie vorfanden, als sie an-
fingen, neuzeitliche Menschen zu sein.“
Der wissenschaftliche Aufwand scheint ein literarisches Ziel zu haben: er
trägt Material zu einem Roman über ein gesellschaftlich relevantes Thema
herbei. Kirchner und Dath versuchen sich – einzeln und zu zweit – seit über
einem Jahrzehnt im erzählenden Genre. Barbara Kirchner schrieb den Roman
„Die verbesserte Frau“ (2001), gemeinsam mit Dietmar Dath verfasste sie
„Schwester Mitternacht“ (2002). Es handelt sich um Thriller mit Science Fic-
tion, auch mit gezielt eingesetzter Pornographie.
Es sind zugleich politische Texte. Thema ist die Einfunktionierung von Wis-
senschaft in Macht und Herrschaft. Ein programmatisches Gerüst wurde 2008
in der Programmschrift „Maschinenwinter“ von Dietmar Dath sichtbar. Orien-
tiert an Marx und Saint-Simon hält er sich nicht damit auf, Wissenschaft und
Technik als instrumentelle Vernunft zu verbellen, sondern sieht sie als durch
eine verkehrte Gesellschaft gefesselte Emanzipations-Potentiale. Der letzte
Satz lautet: „Die Menschen müssen ihre Maschinen befreien, damit die sich
revanchieren können.“
Barack Obama Bill Clinton Angela Merkel</textarea></br>
<button id="validate_text">validate</button>
<div id="linked_text"></div>
<script type="text/javascript">
    var linker = new WikiLink('div#linked_text');

    jQuery(document).ready(function(){
        linker.listen();
    });
</script>
