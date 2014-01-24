//Hier ist alles nötige für die Progressbar
var prg_length_1 = 0;
var prg_length_2 = 0;
var prg_length = 0;
var prg_status = 0;
//Ende Progressbar

function eraseDuplictions(arrayString){
    var uniques = [];
    for(var i =0; i < arrayString.length; i++){
        if(uniques.indexOf(arrayString[i]) === -1)
            uniques.push(arrayString[i]);
    }
    return uniques;
};

/**
 * Wikilink verwaltet Anfragen zu Wikipedia, bereitet den zu verlinkenden Text auf 
 * und fügt in die Vorschau ein.
 * 
 * @param {String} sourceSelector : der CSS-Selector für das DOM-Objekt, das den zuverlinkende Text enthält
 * @param {String} targetSelector : der CSS-Selector, für das DOM-Objekt, das den verlinkten Text empfängt
 * @returns {WikiLink}
 */
var WikiLink = function(sourceSelector, targetSelector){
    this.source = jQuery(sourceSelector);
    this.target = jQuery(targetSelector);
    this.head = jQuery('head');
};

/**
 * Traversiert den zu verlinkenden Text, um alle identischen 
 * Treffer aus der OpenSearch-Wikipedia zu verlinken. 
 * 
 * @param {String} text ist der zu verlinkende Text
 * @returns {undefined}
 */
WikiLink.prototype.traverse = function(text){
    var tokens = this.getTokens(text);

    prg_status = 1;
	prg_length_1 = tokens.length;
	prg_programmpart = 0;
	document.getElementById('prg_bar').innerHTML = '';
    
    //wikipedia nach zwei aufeinander folgenden Wörtern suchen
    //im zuverlinkenden Text zu Wikipedia verlinken
    //Wichtig!!!: linker ist eine WikiLink-Instanz mit dem Namen 'linker', deren Existent vorauszusetzt wird 
    for(var index = 0; index < tokens.length-1; index += 1){
        this.openSearch(tokens[index]+' '+tokens[index+1], 'linker.identicalApplication');
		//progress = (index/length) * 50;
		//document.getElementById('prg_bar').style.width = progress + '%';
    }
    
    //alle Mehrfachauftreten im Tokenstrom eliminieren 
    var limitedTokens = eraseDuplictions(tokens);
	prg_length_2 = limitedTokens.length;
	prg_length = prg_length_1 + prg_length_2;
    //console.log(limitedTokens);
    
    for(var index = 0; index < limitedTokens.length; index += 1){
        this.openSearch(limitedTokens[index], 'linker.identicalApplication');
		//progress = 50 + ((index/length) * 50);
		//document.getElementById('prg_bar').style.width = progress + '%';
    }
};

/**
 * Erzeugt und gibt das Array mit alle deutschen Wörter, die mit 
 * Großbuchstaben im übergebenen Text anfangen, zurück.
 * 
 * @param {String} text der zu verlinkende Text
 * @returns alle deutschen Wörter, die mit Großbuchstaben anfangen
 */
WikiLink.prototype.getTokens = function(text){
    return text.match(/[A-ZÄÖÜ][äöüÄÖÜß\w]+/g);
};

/**
 * Freie Suche in Wikipedia nach der Suchnadel und anschließend 
 * erfolgt der Aufruf der übergebenen Callback-Funktion, falls
 * eine übergeben wird.
 * 
 * @param {String} needle ist die Suchnadel
 * @param {String} callback ist die aufzurufende Callback-Funktion
 */
WikiLink.prototype.openSearch = function(needle, callback){
    var url = 'http://de.wikipedia.org/w/api.php?action=opensearch&search='+needle+'&format=json';
    if(typeof callback !== 'undefined')        
        url += '&callback='+callback;
    
    this.head.append('<script src="'+url+'" type="text/javascript"></script>');
};

/**
 * Man verwertet nur den von der Opensearch gelieferten Treffer,
 * der mit der Suchnadel identisch ist.
 *  
 * @param {Array} response die von der OpenSearch gelieferten Treffer
 */
WikiLink.prototype.identicalApplication = function(response){
    //console.log(response);
    var needle = response[0];  //die zuverlinkende Suchnadel 
    var results = response[1]; //results ist ein Array mit allen Treffern bezüglich der Suchnadel
    
    //suche nach dem index, der den identischen Treffer in results referenziert
    //Wichtig: falls kein identischer Treffer existiert enthält index die Länge von results
    var index = 0;
    while( index < results.length && needle !== results[index]){ //suche nach dem identischen Treffer
        index += 1;
    };
    
    if(index !== results.length){       //falls ein identischer Treffer existiert
        var link = '<a target="_new" href="http://de.wikipedia.org/wiki/'+results[index]+'">'+results[index]+'</a>';
        this.replace(needle, link);  //verlinke den Zieltext
    } else {
        //Progress Bar
        prg_status = prg_status + 1;
        var progress = (prg_status/prg_length)*100;
        document.getElementById('prg_bar').style.width = progress + '%';
        document.getElementById('prg_status_percent').innerHTML = Round2Dec(progress);
        console.log("Fortschritt : " + progress + "  und Status : " + prg_status + "  und Länge: " + prg_length);
        if (progress >= 99.99) {
            document.getElementById('prg_status_percent').innerHTML = 'FINISHED';
            document.getElementById('prg_bar').style.width = '0%';
            document.getElementById('prg_bar').innerHTML = 'FINISHED';
        }
        //PG Bar Stop
    }
};

/**
 * Die Suchnadel wird durch den replace-Wert im Zieltext ersetzt.
 *  
 * @param {String} needle ist die zu ersetzende Suchnadel
 * @param {String} replace der Wert, durch den ersetz wird 
 * 
 */
WikiLink.prototype.replace = function(needle, replace){
    var textNode;   
    var linkedText; 
    this.target.contents().each(function(){//traversiere über die Dom-Struktur vom zu verlinkenden Text
        if(this.nodeType === 3){                //betrachte nur den Dom-Typ Text, der den nodeTyp 3 ist
            textNode = jQuery(this);            //mach aus dem aktuellen TextNode ein jQuery Objekt
            linkedText = textNode.text().replace(new RegExp(needle, 'g'), replace);
            textNode.replaceWith(linkedText);   //tausche nun im Text die Suchnadel mit seinem Link
        }
    });
    //Progress Bar
    prg_status = prg_status + 1;
    var progress = (prg_status/prg_length)*100;
    document.getElementById('prg_bar').style.width = progress + '%';
    document.getElementById('prg_status_percent').innerHTML = Round2Dec(progress);
    console.log("Fortschritt : " + progress + "  und Status : " + prg_status + "  und Länge: " + prg_length);
    if (progress >= 99.99) {
        document.getElementById('prg_status_percent').innerHTML = 'FINISHED';
        document.getElementById('prg_bar').style.width = '0%';
        document.getElementById('prg_bar').innerHTML = 'FINISHED';
    }
    //PG Bar Stop
};

WikiLink.prototype.pushOpenSearchToWikiBox = function(data){
    var results = data[1];
    
    for(var index in results){
        results[index] = '<div><a target="_new" href="http://de.wikipedia.org/wiki/'+results[index]+'">'+results[index]+'</a></div>';
    }
    wikiBox.empty().pushAll(results);
    jQuery('ul#wiki_box_list').empty();
    wikiBox.display();
};

/**
 * Sollte stets nach dem eine Wikilinkinstanz erstellt wurde
 * in der document-ready-Closure gerufen werden.
 */
WikiLink.prototype.listen = function(){
    var that = this;
    
    jQuery(document).on('click', 'button#validate_text', function(){
        var text = that.source.val();   //den zu verlinkenden Text extrahieren
        that.target.html(text);         //füge den rohen Text in die Vorschau ein
        that.traverse(text);            //verlinke den Vorschautext bezüglich seine Treffer aus der opensearch 
    });
};

function Round2Dec(x) { 
	result = Math.round(x * 100) / 100 ; 
	return result; 
};

/**
 * Crawler stellt Funktion für das Traversieren der Webseite der übergebenen Url bereit.
 * Und übergibt die gefundenen Text-Nodes an WikiLink.
 * 
 * @param {String} sourceSelector
 * @param {String} triggerSelector
 * @param {String} controller directory von PHP-controller der bei einer ajax-Anfrage aufgerufen wird
 */

var Crawler = function(sourceSelector, triggerSelector){
    this.source = jQuery(sourceSelector);
    this.trigger = jQuery(triggerSelector);
    this.destiny = jQuery('div#website_text');
    this.controllerPath = '\controller.php';
};

Crawler.prototype.crawl = function(url){
    var that = this;
    var list = this.list;
   
    var data = {
        task : 'crawl',
        url : url
    };

    jQuery.ajax({
        url: that.controllerPath,
        data: data,
        type: 'get',
        success: 
                function(textNodes){
                    //console.log(textNodes);
                    that.display(JSON.parse(textNodes));
                }
    });
};

Crawler.prototype.display = function(textNodes){
    var text;
    for(var index in textNodes){
        text =  textNodes[index].text;
        this.destiny.append('<p>'+text+'</p>');
    }
};

Crawler.prototype.listen = function(){
    var that = this;
    
    this.trigger.click(function(){
        var url = that.source.val();
        that.crawl(url);
    });
};
