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

var WikiLink = function(destinySelector){
    this.selector = destinySelector;
    this.destiny = jQuery(destinySelector);
    this.entries = new Array();
    this.target = jQuery('#linked_text');
    this.head = jQuery('head');
};

WikiLink.prototype.traverse = function(text){
    var tokens = this.getTokens(text);
    //console.log(tokens);
	prg_status = 1;
	prg_length_1 = tokens.length;
	prg_programmpart = 0;
	document.getElementById('prg_bar').innerHTML = '';
    
    for(var index = 0; index < tokens.length-1; index += 1){
        this.openSearch(tokens[index]+' '+tokens[index+1], 'linker.query');
		//progress = (index/length) * 50;
		//document.getElementById('prg_bar').style.width = progress + '%';
    }
    var limitedTokens = eraseDuplictions(tokens);
	prg_length_2 = limitedTokens.length;
	prg_length = prg_length_1 + prg_length_2;
    console.log(limitedTokens);
    
    for(var index = 0; index < limitedTokens.length; index += 1){
        this.openSearch(limitedTokens[index], 'linker.query');
		//progress = 50 + ((index/length) * 50);
		//document.getElementById('prg_bar').style.width = progress + '%';
    }
};

WikiLink.prototype.getTokens = function(text){
    //finde alle deutschen Wörter, die mit Großbuchstaben anfangen    
    return text.match(/[A-ZÄÖÜ][äöüÄÖÜß\w]+/g);
};

WikiLink.prototype.openSearch = function(needle, callback){
    var url = 'http://de.wikipedia.org/w/api.php?action=opensearch&search='+needle+'&format=json';
    if(typeof callback !== 'undefined')        
        url += '&callback='+callback;
    
    this.head.append('<script src="'+url+'" type="text/javascript"></script>');
};

WikiLink.prototype.query = function(response){
    console.log(response);
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
    var textNode;
    var text;
    this.target.contents().each(function(){
        if(this.nodeType === 3){
            textNode = jQuery(this);
            text = textNode.text().replace(new RegExp(needle, 'g'), output);
            textNode.replaceWith(text);
			//TODO Update progress bar here
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

WikiLink.prototype.listen = function(){
    var that = this;
    
    jQuery(document).on('click', 'button#validate_text', function(){
        var test = jQuery('#test');
        var target = jQuery('#linked_text');
        target.html(test.val());
        that.traverse(jQuery('#test').val());
    });
};

function Round2Dec(x) { 
	result = Math.round(x * 100) / 100 ; 
	return result; 
};