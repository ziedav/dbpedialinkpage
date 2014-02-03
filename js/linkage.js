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
    this.tokenStream = new TokenStream();
    this.controllerPath = '/controller.php';
    this.bar = new ProgressBar();
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
    //wir beschränken uns auf maximal vier nacheinander 
    //geschriebenen großgeschriebenen Wörter im Text
    var tokensCollection = this.tokenStream.stream(text);
    var tokens;
    
    //reset progress bar
    var amountOfNeedles = 0;
    
    for(var index in tokensCollection){
        tokens = tokensCollection[index];
        amountOfNeedles += tokens.length;
    }
    this.bar.reset(amountOfNeedles, 0);
    
    //lookUp for needles
    var that = this;
    for(var index in tokensCollection){
        tokens = tokensCollection[index];
        this.lookUpTokens(tokens, function(unReferencedTokens){
            var needle;
            for(var index in unReferencedTokens){
                needle = unReferencedTokens[index];
                that.openSearch(needle, 'linker.identicalApplication');
            }
        });
    }
};

/**
 * lookUpTokens verarbeitet zunächst alle Suchnadeln in der Datenbank und 
 * die unreferenzierten Tokens, die übrig bleiben, werden an den handler
 * weitergereicht.
 * 
 * @param {ArrayString} tokens
 * @param {handler} handler
 */
WikiLink.prototype.lookUpTokens = function(tokens, handler){
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
                    var counter;
                    var needle;
                    var referencedNeedles = new Array();
                    
                    for(var index in hits){
                        hit = hits[index];
                        href = hit.link;
                        needle = hit.wort;
                        counter = parseInt(hit.aufrufe)+1;
                        referencedNeedles.push(needle);
                        
                        if(hit.anzeige === '1' && href !== ''){
                            that.replace(needle, that.hrefToLink(href, needle, counter+' Aufrufe'));
                        } else {
                            that.bar.increment(1);
                        }
                    }
                    
                    if(typeof handler !== 'undefined'){
                        complement(referencedNeedles, tokens);
                        handler(tokens);
                    }
                }
    });
};

WikiLink.prototype.hrefToLink = function(href, needle, title){
    if(typeof title !== 'string'){
        title = '';
    } else {
         title = 'title="'+title+'"';
    }
    
    return '<a target="_new" '+title+' href="'+href+'">'+needle+'</a>';
};

function complement(subArray, array){
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
        if(this.nodeType === 1){                        //betrachte nur den Dom-Typ p, der den nodeTyp 1 hat
            jQuery(this).contents().each(function(){    // a tags nicht tangieren deshalb direkt uaf textNodes zugreifen
                if(this.nodeType === 3){
                    textNode = jQuery(this);            //mach aus dem aktuellen TextNode ein jQuery Objekt
                    linkedText = textNode.text().replace(new RegExp(needle, 'g'), replace);
                    textNode.replaceWith(linkedText);   //tausche nun im Text die Suchnadel mit dem Link
                }
            });
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
    
    var href;
    if(index !== results.length){//falls ein identischer Treffer existiert
        //var link = '<a target="_new" href="http://de.wikipedia.org/wiki/'+results[index]+'">'+results[index]+'</a>';
        href = this.needleToHref(results[index]);
        this.replace(needle, this.hrefToLink(href, needle));  //verlinke den Zieltext
    } else {//sonst erfasse in der Datenbank, dass kein eindeutiges Ergebnid zurückliefert
        href = '';
        this.bar.increment(1);
    }
    
    this.cache(needle, href);
};

WikiLink.prototype.needleToHref = function(needle){
    return 'http://de.wikipedia.org/wiki/'+needle;
};

/**
 * deprecated but still in use
 * 
 * @param {type} word
 * @param {type} href
 * @returns {undefined}
 */
WikiLink.prototype.cache = function(word, href){
    var that = this;
   
    var data = {
        task : 'insert_word',
        word : word,
        link: href
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
    
    jQuery(document).on('click', 'button#validate_text', function(){
        var text = source.contents().text();   //den zu verlinkenden Text extrahieren
        that.traverse(text);            //verlinke den Vorschautext bezüglich seine Treffer aus der opensearch
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
    }
};

function Round2Dec(x) { 
	var result = Math.round(x * 100)/100; 
	return result; 
};

var Editor = function(destinySelector){
    this.destiny = jQuery(destinySelector);
    this.pages = new Array();
    
    this.crawler = new Crawler('#url_input', 'button#crawl_by_url', logged_user);
};

Editor.prototype.display = function(pageIndex){
	this.destiny.empty();
    this.displayedPage = pageIndex;
    jQuery('b#page_number').html(this.displayedPage+1);
    var page = this.pages[pageIndex];
    
    var pContent;
    for(var index in page){
        pContent = page[index];
        this.destiny.append('<p>'+pContent+'</p>');
    }
};

Editor.prototype.saveTemporary = function(){
    this.pages[this.displayedPage] = new Array();
    var that = this;
    this.destiny.contents().each(function(){
         that.pages[that.displayedPage].push(jQuery(this).html());
    });
};

Editor.prototype.listen = function(){
    this.crawler.listen();
    
    var that = this;
    var next;
    jQuery('#next').click(function(){
        var next = that.displayedPage+1;
        if(next === that.pages.length){
            next = 0;
        }
        that.saveTemporary();
        that.display(next);
    });
    
    var back;
    jQuery('#back').click(function(){
        var back = that.displayedPage-1;
        if(back === -1){
            back = that.pages.length-1;
        }
        that.saveTemporary();
        that.display(back);
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

var Crawler = function(sourceSelector, triggerSelector, user_logged){    
    this.source = jQuery(sourceSelector);
    this.trigger = jQuery(triggerSelector);
	this.user = user_logged;
    
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
                    editor.pages = new Array();
                    textNodes = JSON.parse(textNodes);
                    
                    var text;
                    var page = new Array();
                    for(var index in textNodes){
                        text =  textNodes[index].text;
                        page.push(text);
                        if(page.length > 9){
                            editor.pages.push(page);
                            page = new Array();
                        }
                    }
                    
                    if(page.length > 0){
                        editor.pages.push(page);
                    }
                    
                    editor.display(0);
                    jQuery('b#page_numbers').html(editor.pages.length);
                }
    });
};

//Schreibe in DB
Crawler.prototype.writedatabase = function(url){
    var that = this;
    var list = this.list;
   
    var data = {
        task : 'insert_url',
        url : url,
		user : that.user
    };

    jQuery.ajax({
        url: that.controllerPath,
        data: data,
        type: 'get'
    });
};

Crawler.prototype.listen = function(){
    var that = this;
    
    this.trigger.click(function(){
        var url = that.source.val();
        that.crawl(url);
		that.writedatabase(url);
    });
};