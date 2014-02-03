var TokenStream = function(){
    
};

TokenStream.prototype.text = '';

TokenStream.prototype.stream = function(text){
    TokenStream.prototype.text = text;
    this.reset();
    this.traverse();
    
    return this.tokenCollector;
};

TokenStream.prototype.reset = function(){
    this.text = TokenStream.prototype.text;
    this.tokenCollector = new Array();
};

TokenStream.prototype.traverse = function(){
    var tokens;
    var token;
    
    for(var wordCount = 4; wordCount > 0; wordCount -= 1){
        tokens = this.getCapitalGatheredWords(this.text, wordCount);
        if(tokens !== null){
            this.tokenCollector.push(tokens);
        
            for(var index in tokens){
                token = tokens[index];
                this.text = this.text.replace(new RegExp(token, 'g'), '');
            }
        }
    }
};

/**
 * Erzeugt und gibt das Array mit alle deutschen Wörter, die mit 
 * Großbuchstaben im übergebenen Text anfangen, zurück und 
 * entfernt alle Duplikate.
 * 
 * @param {String} text der zu verlinkende Text
 * @param {Int}    wordCount Anzahl der zusammenhängenden deutschen Wörter
 * @returns alle deutschen Wörter, die mit Großbuchstaben anfangen
 */
TokenStream.prototype.getCapitalGatheredWords = function(text, wordCount){
    if(typeof wordCount === "undefined" || wordCount < 1){
        wordCount = 1;
    }
    
    var word = '\[A-ZÄÖÜ\]\[äöüÄÖÜß\\w\]\*';
    //var separator = '\(-\|\\.\{0,1\}\\s\)'; //bspl. George H. W. Bush
    var separator = '\(-\|\\s\)';
    var pattern = word;
    
    for(var i = 1; i < wordCount; i += 1){
        pattern += separator+word;
    }
    
    var matches = text.match(new RegExp(pattern, 'g'));
    if(matches === null){
        return null;
    } else {
        return getUnique(matches);
    }
};

function getUnique(tokens){
    var uniques = [];
    
    for(var i = 0; i < tokens.length; i++){
        if(uniques.indexOf(tokens[i]) === -1)
            uniques.push(trim(tokens[i]));
    }
    
    return uniques;
};

function trim(text){
    return text.replace(/^\s+|\s+$/g, '');
}