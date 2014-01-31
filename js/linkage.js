/**
 * Wikilink verwaltet Anfragen zu Wikipedia, bereitet den zu verlinkenden Text auf 
 * und fügt in die Vorschau ein.
 * 
 * @param {String} sourceSelector : der CSS-Selector für das DOM-Objekt, das den zuverlinkende Text enthält
 * @param {String} targetSelector : der CSS-Selector, für das DOM-Objekt, das den verlinkten Text empfängt
 * @returns {WikiLink}
 */
var WikiLink = function(sourceSelector, targetSelector){    
    this.sourceSelector = sourceSelector;
    this.targetSelector = targetSelector;
    this.head = jQuery('head');
    this.bar = new ProgressBar();
    
    this.controllerPath = '/controller.php';;
};

/**
 * Traversiert den zu verlinkenden Text, um alle identischen 
 * Treffer aus der OpenSearch-Wikipedia zu verlinken, wobei
 * zuerst die Datenbank nach den Begriffen abgefragt wird. 
 * 
 * @param {String} text ist der zu verlinkende Text
 * @returns {undefined}
 */
WikiLink.prototype.traverse = function(text){
    var tokens = this.getTokens(text);
    this.bar.reset(tokens.length, 0);
    /*for(var index in tokens){
        this.lookUp(tokens[index], 'linker.identicalApplication');
    }*/
    
    var that = this;
    this.lookUpTokens(tokens, function(unReferencedTokens){
        var needle;
        
        //that.bar.increment(that.bar.prg_length - unReferencedTokens.length);
        for(var index in unReferencedTokens){
            needle = unReferencedTokens[index];
            that.openSearch(needle, 'linker.identicalApplication');
        }
    });
};

/**
 * Erzeugt und gibt das Array mit alle deutschen Wörter, die mit 
 * Großbuchstaben im übergebenen Text anfangen, zurück und 
 * entfernt alle Duplikate.
 * 
 * @param {String} text der zu verlinkende Text
 * @returns alle deutschen Wörter, die mit Großbuchstaben anfangen
 */
WikiLink.prototype.getTokens = function(text){
    var tokens = text.match(/[A-ZÄÖÜ][äöüÄÖÜß\w]+/g);
    var uniques = [];
    
    for(var i = 0; i < tokens.length; i++){
        if(uniques.indexOf(tokens[i]) === -1)
            uniques.push(tokens[i]);
    }
    
    return uniques;
};

/**
 * lookUp bearbeitet nur eine Suchnadel
 *  
 * @param {String} needle
 * @param {handler} requestHandler
 */
WikiLink.prototype.lookUp = function(needle, requestHandler){
    var that = this;
    
    var data = {
        task : 'get_word',
        word : needle
    };
    
    jQuery.ajax({
        url: that.controllerPath,
        data: data,
        type: 'get',
        success: 
                function(href){
                    if(href !== ''){
                        that.replace(needle, that.hrefToLink(href, needle));
                    } else {
                        that.openSearch(needle, requestHandler);
                    }
                }
    });
};

/**
 * lookUpTokens verarbeitet zunächst alle Suchnadeln in der Datenbank und 
 * die unreferenzierten Tokens, die übrig bleiben, werden an den handler
 * weitergereicht.
 * 
 * @param {ArrayString} tokens
 * @param {handler} callback
 */
WikiLink.prototype.lookUpTokens = function(tokens, callback){
    var that = this;
    
    var data = {
        task : 'get_words',
        tokens : tokens
    };
    
    jQuery.ajax({
        url: that.controllerPath,
        data: data,
        type: 'get',
        success: 
                function(jsonedHitsString){
                    var hits = JSON.parse(jsonedHitsString);
                    var hit;
                    var href;
                    var needle;
                    var referencedNeedles = new Array();
                    
                    for(var index in hits){
                        hit = hits[index];
                        href = hit.link;
                        needle = hit.wort;
                        
                        referencedNeedles.push(needle);
                        
                        if(hit.anzeige === '1' && href !== ''){
                            that.replace(needle, that.hrefToLink(href, needle));
                        } else {
                            that.bar.increment(1);
                        }
                    }
                    
                    setToComplement(referencedNeedles, tokens);
                    
                    if(typeof callback !== 'undefined'){
                        callback(tokens);
                    }
                }
    });
};

WikiLink.prototype.hrefToLink = function(href, needle){
    return '<a target="_new" href="'+href+'">'+needle+'</a>';
};

function setToComplement(subArray, array){
    var index;
    for(var i in subArray){
        index = array.indexOf(subArray[i]);
        if(index !== -1){
            array.splice(index, 1);
        }
    }
}

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
    jQuery(this.targetSelector).contents().each(function(){//traversiere über die Dom-Struktur vom zu verlinkenden Text
        if(this.nodeType === 3){                //betrachte nur den Dom-Typ Text, der den nodeTyp 3 ist
            textNode = jQuery(this);            //mach aus dem aktuellen TextNode ein jQuery Objekt
            linkedText = textNode.text().replace(new RegExp(needle, 'g'), replace);
            textNode.replaceWith(linkedText);   //tausche nun im Text die Suchnadel mit dem Link
        }
    });
    this.bar.increment(1);
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
    
    if(index !== results.length){//falls ein identischer Treffer existiert
        //var link = '<a target="_new" href="http://de.wikipedia.org/wiki/'+results[index]+'">'+results[index]+'</a>';
        var href = this.needleToHref(results[index]);
        this.cache(needle, href);                             //erfasst den Eintrag in der Datenbank
        this.replace(needle, this.hrefToLink(href, needle));  //verlinke den Zieltext
    } else {//sonst erfasse in der Datenbank, dass kein eindeutiges Ergebnid zurückliefert
        this.cache(needle, '');
        this.bar.increment(1);
    }
};

WikiLink.prototype.needleToHref = function(needle){
    return 'http://de.wikipedia.org/wiki/'+needle;
};

WikiLink.prototype.cache = function(word, link){
    var that = this;
   
    var data = {
        task : 'insert_word',
        word : word,
        link: link
    };

    jQuery.ajax({
        url: that.controllerPath,
        data: data,
        type: 'get'
    });
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
    var source = jQuery(this.sourceSelector);
    var target = jQuery(this.targetSelector);
    
    jQuery(document).on('click', 'button#validate_text', function(){
        var text = source.val();   //den zu verlinkenden Text extrahieren
        target.html(text);         //füge den rohen Text in die Vorschau ein
        that.traverse(text);            //verlinke den Vorschautext bezüglich seine Treffer aus der opensearch
    });
};

/**
 * Crawler stellt Funktion für das Traversieren der Webseite der übergebenen Url bereit.
 * Und übergibt die gefundenen Text-Nodes an WikiLink.
 * 
 * @param {String} sourceSelector
 * @param {String} triggerSelector
 * @param {String} destinySelector
 */

var Crawler = function(sourceSelector, triggerSelector, destinySelector){    
    this.source = jQuery(sourceSelector);
    this.trigger = jQuery(triggerSelector);
    this.destiny = jQuery(destinySelector);
    
    this.controllerPath = '/controller.php';
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
                    that.destiny.empty();
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

var ProgressBar = function(){
    this.reset(0, 0);
};

ProgressBar.prototype.reset = function(prg_length, prg_status){
    this.prg_length = prg_length;
    this.prg_status = prg_status;
    document.getElementById('prg_bar').innerHTML = '';
};

ProgressBar.prototype.increment = function(status){
    if(typeof status === 'undefined'){
        status = 1;
    }
    
    this.prg_status = this.prg_status + status;
    var progress = (this.prg_status/this.prg_length)*100;
    document.getElementById('prg_bar').style.width = progress + '%';
    document.getElementById('prg_status_percent').innerHTML = Round2Dec(progress);
    if (progress >= 99.99) {
        document.getElementById('prg_status_percent').innerHTML = 'FINISHED';
        document.getElementById('prg_bar').style.width = '0%';
        document.getElementById('prg_bar').innerHTML = 'FINISHED';
    }
};

function Round2Dec(x) { 
	var result = Math.round(x * 100)/100; 
	return result; 
};

var Editor = function(editorSelector){
    this.editorSelector = editorSelector;
    this.linker = new WikiLink(editorSelector+' p', editorSelector+' p');
};

Editor.prototype.listen = function(){
    var that = this;
    var editor = this.editorSelector;
    
    jQuery(document).on('click', editor+' p',function(){
        var linkTarget = jQuery(this);
        that.linker.traverse(linkTarget.text());
    });
};