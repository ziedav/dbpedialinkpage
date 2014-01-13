function traverse(text){
    var words = text.split(/\s+/);
    for(var i in words){
        checkavailability(words[i], 'linkInput');
    };
};

function linkInput(data){
    console.log(data);
    var postIds = data[1];
    for(var i in postIds){
        var text = postIds[i];
        var url = 'http://de.wikipedia.org/wiki/' + text;
        jQuery('body').append('<div><a target="_new" href="' + url + '">' + text + '</a>'+'</div>');
    }
};

var WikiLink = function(destinySelector){
    this.selector = destinySelector;
    this.destiny = jQuery(destinySelector);
    this.entries = new Array();
    this.target = jQuery('#linked_text');
    this.head = jQuery('head');
};

WikiLink.prototype.traverse = function(text){
    var tokens = this.getTokens(text);
    console.log(tokens);
    
    for(var index in tokens){
        this.openSearch(tokens[index], 'linker.query');
        //this.openSearch(tokens[index]);
    }
};

WikiLink.prototype.getTokens = function(text){
    //finde alle deutschen Wörter, die mit Großbuchstaben anfangen
    var words = text.match(/[A-ZÄÖÜ][äöüÄÖÜß\w]+/g);
    //eliminiere alle Duplikate
    var tokens = [];
    for(var i =0; i < words.length; i++){
        if(tokens.indexOf(words[i]) === -1)
            tokens.push(words[i]);
    }
    
    return tokens;
};

WikiLink.prototype.openSearch = function(needle, callback){
    var url = 'http://de.wikipedia.org/w/api.php?action=opensearch&search='+needle+'&format=json';
    if(typeof callback !== 'undefined')        
        url += '&callback='+callback;
    
    this.head.append('<script src="'+url+'" type="text/javascript"></script>');
};

WikiLink.prototype.query = function(response){
    var needle = response[0];
    var results = response[1];
    
    var index = 0;
    while( index < results.length && needle !== results[index]){
        index += 1;
    };
    
    var output = needle;
    if(index !== results.length){
        output = '<a target="_new" href="http://de.wikipedia.org/wiki/'+results[index]+'">'+results[index]+'</a>';
    }
    
    this.link(needle, output);
};

WikiLink.prototype.link = function(needle, output){
    /*console.log('needle: "'+needle+'" || replacer: '+output);
    var text = this.target.html();
    text = text.replace(new RegExp(needle, 'g'), output);
    this.target.html(text);*/
    var textNode;
    var text;
    this.target.contents().each(function(){
        if(this.nodeType === 3){
            textNode = jQuery(this);
            text = textNode.text().replace(new RegExp(needle, 'g'), output);
            textNode.replaceWith(text);
        }
    });
    //console.log(this.target.contents());
};

WikiLink.prototype.listen = function(){
    var that = this;
    
    jQuery(document).on('click', 'button#validate_text', function(){
        var test = jQuery('#test');
        var target = jQuery('#linked_text');
        target.html(test.val());
        that.traverse(jQuery('#test').val());
    });
};
