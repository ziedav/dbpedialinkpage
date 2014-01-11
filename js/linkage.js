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

var TextCrawler = function(){
    
};

TextCrawler.prototype.getTokens = function(text){
    var words = text.split(/\b/);
    
    return words;
};

var crawler = new TextCrawler();

var WikiLink = function(destinySelector){
    this.selector = destinySelector;
};

WikiLink.prototype.traverse = function(text){
    var tokens = crawler.getTokens(text);
    console.log(tokens);
    for(var index in tokens){
        this.openSearch(tokens[index], 'linker.query');
    }
};

WikiLink.prototype.openSearch = function(needle, callback){
    var url = 'http://de.wikipedia.org/w/api.php?action=opensearch&search='+needle+'&format=json&callback='+callback;
    jQuery('head').append('<script src="'+url+'" type="text/javascript"></script>');
};

WikiLink.prototype.query = function(response){
    var needle = response[0];
    var results = response[1];
    
    //console.log(response);
    //this.link(needle, results[0]);
};

WikiLink.prototype.link = function(needle, wikiEntry){
    var output = '';
    if(typeof wikiEntry !== 'undefined'){
        var url = 'http://de.wikipedia.org/wiki/'+wikiEntry;
        output = '<a target="_new" href="' + url + '">' + needle + '</a>';
    } else {
        output = needle;
    }
    
    jQuery(this.selector).append(output);
};

WikiLink.prototype.listen = function(){
    var that = this;
    
    jQuery(document).on('click', 'button#validate_text', function(){
        that.traverse(jQuery('#test').val());
    });
};

var linker = new WikiLink('div#linked_text');

jQuery(document).ready(function(){
    linker.listen();
});
