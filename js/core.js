if(typeof Function.prototype.inheritsFrom === 'undefined'){
    Function.prototype.inheritsFrom = function(ancestor){ 
        this.prototype = new ancestor;
        this.prototype.constructor = this;
        this.prototype.parent = ancestor.prototype;

        return this;
    };
}

Tag = function(tag, id, cssClass){
    this.tag = tag;
    this.id = id;
    this.cssClass = cssClass;
    this.attributes = {};
};

Tag.prototype.tag = '';
Tag.prototype.id = '';
Tag.prototype.cssClass = '';
Tag.prototype.attributes = {};

Tag.prototype.toHtml = function(content, tagAttributes){
    var html = '<'+this.tag+' id="'+this.id+'"'+this.toAttributes(tagAttributes);
    
    if(typeof this.cssClass !== 'undefined')
        html += ' class="'+this.cssClass+'"';
    html += '>';
    
    if(typeof content !== 'undefined'){
        if(typeof this.view !== 'undefined'){
            html += this.view.show(content);
        } else {
            html += content;
        }
    }
    html += '</'+this.tag+'>'; 
    
    return html;
};

Tag.prototype.toAttributes = function(attributes){
    var attrStr = '';
    if(typeof attributes === 'object'){
        for(var entry in attributes){
            attrStr += ' data-'+entry+'="'+attributes[entry]+'"';
        }
    }
    
    return attrStr;
};

Tag.prototype.getSelector = function(){
    return this.tag+'#'+this.id;
};

Tag.prototype.getQuery = function(){
    return jQuery(this.getSelector());
};

Tag.prototype.addView = function(view){
    this.view = view;
    return this;
};

function TagFactory(tag, id, cssClass){
    return new Tag(tag, id, cssClass);
};

List = function(name){
    this.name = name+List.prototype.name;
    this.items = new Array();
};

List.prototype.name = '_list';
List.prototype.items = null;

List.prototype.empty = function(){
    this.items.length = 0;
    
    return this;
};

List.prototype.push = function(item){
    this.items.push(item);
    return this;
};

List.prototype.pushAll = function(items){
    for(var i=0; i < items.length; i += 1){
        this.push(items[i]);
    }
    
    return this;
};

List.prototype.remove = function(index){
    this.items.splice(index, 1);
    
    return this;
};

var View = function(attrViews){
    if(typeof attrViews === 'undefined')
        this.attrViews = {};
    else 
        this.attrViews = attrViews;
};

View.prototype.attrViews = {};

View.prototype.add = function(tagObj){
    this.attrViews[tagObj.id] = tagObj;
};

View.prototype.show = function(object){
    var view = '';
    for(var entry in object){
        if(typeof this.attrViews[entry] !== 'undefined')
            view += this.attrViews[entry].toHtml(object[entry]);
    }

    return view;
};

ViewList = function(name, tag, itemView){
    List.call(this, name);
    
    this.frame = TagFactory(tag, this.name);
    this.item = TagFactory(deriveItemTag(tag), this.name+'_item');
    if(typeof itemView !== 'undefined')
        this.setItemView(itemView);
};

ViewList.inheritsFrom(List);

ViewList.prototype.frame = null;
ViewList.prototype.item = null;

ViewList.prototype.bindTo = function(anchor, jDomManipulator){
    if(typeof jDomManipulator !== 'undefined')
        anchor[jDomManipulator](this.frame.toHtml());
    else
        anchor.append(this.frame.toHtml());
    
    return this;
};

ViewList.prototype.setItemView = function(view){
    this.item.addView(view);
};

ViewList.prototype.display = function(start, end){
    if(typeof start === 'undefined'){
        start = 0;
    }
    if(typeof end === 'undefined'){
        end = this.items.length;
    }
    var wrapper = this.frame.getQuery();
    
    for(var i = start; i < end; i += 1){
        wrapper.append(this.item.toHtml(this.items[i]));
    }
};

ViewList.prototype.listen = function(){
    jQuery(document).on('click', this.item.getSelector(), function(){
        //jQuery(this).css('background', 'red');
    });
};

var Scroller = function(name, tag, itemView){
    ViewList.call(this, name, tag, itemView);
};

Scroller.inheritsFrom(ViewList);

Scroller.prototype.listen = function(){
    this.parent.listen.call(this);
    
    jQuery(document).on('click', this.item.getSelector(), function(){
        //alert('scroller');
    });
};

function deriveItemTag(tag){
    switch(tag){
        case 'div':
            return 'div';
            break;
        case 'ul':
            return 'li';
            break;
    }
};

function ViewFactory (type, id, tag){
    switch (type){
        case 'list':
            return new ViewList(id, tag);
            break;
    }
};