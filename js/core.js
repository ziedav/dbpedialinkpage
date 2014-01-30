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
};

Tag.prototype.tag = '';
Tag.prototype.id = '';
Tag.prototype.cssClass = '';

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

Tag.prototype.execute = function(jQueryFunction){
    this.getQuery()[jQueryFunction]();
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
};

List.prototype.pushAll = function(items){
    for(var i=0; i < items.length; i += 1){
        this.push(items[i]);
    }
};

List.prototype.remove = function(index){
    this.items.splice(index, 1);
};

List.prototype.removeBy = function(value){
    var index = this.items.indexOf(value);
    if(index !== -1){
        this.remove(index);
    }
};

List.prototype.value = function(index){
    return this.items[index];
};

var View = function(attrViews){
    if(typeof attrViews === 'undefined')
        this.attrViews = {};
    else 
        this.attrViews = attrViews;
};

View.prototype.attrViews = {};

View.prototype.add = function(tagObj, text){
    if(typeof text === 'undefined'){
        this.attrViews[tagObj.id] = tagObj;
    } else {
        this.attrViews[tagObj.id] = tagObj.toHtml(text);
    }
};

View.prototype.show = function(object){
    var view = '';
    for(var entry in this.attrViews){//also object possible for further development
        if(typeof this.attrViews[entry] !== 'undefined'){
            if(typeof this.attrViews[entry] === 'string'){
                view += this.attrViews[entry];
            } else {
                view += this.attrViews[entry].toHtml(object[entry]);
            }
        }
    }

    return view;
};

ViewList = function(name, tag, itemView){
    List.call(this, name);
    this.visible = true;
    
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

ViewList.prototype.empty = function(){
    this.parent.empty.call(this);
    this.frame.getQuery().empty();
    
    return this;
};

ViewList.prototype.showItems = function(start, end){
    if(typeof start === 'undefined'){
        start = 0;
    }
    
    if(typeof end === 'undefined'){
        end = this.items.length;
    }
    
    var child;
    this.frame.getQuery().children().each(function(index){
        if(index >= start && index < end){
            child = jQuery(this);
            if(child.is(':hidden')){
                child.show();
            }
        }
    });
    
    return this;
};

ViewList.prototype.hideItems = function(start, end){
    if(typeof start === 'undefined'){
        start = 0;
    }
    
    if(typeof end === 'undefined'){
        end = this.items.length;
    }
    
    this.frame.getQuery().children().each(function(index){
        if(index >= start && index < end){
            jQuery(this).hide();
        }
    });
    
    return this;
};

ViewList.prototype.hide = function(){
    this.frame.getQuery().hide();
    this.visible = false;
    
    return this;
};

ViewList.prototype.show = function(){
    this.frame.getQuery().show();
    
    return this;
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

function popUp(obj){
    var defaults = {
        speed: 500,
        overlayerOpacity: 0.8,
        containerOpacity: 1
    };

    var objects = {
        overlayer: jQuery('#overlayer'),
        content: jQuery('#overlayer_content')
    }; 

    var fn = {
        popUpOverlayer: function(){
            objects.overlayer.fadeTo(defaults.speed, defaults.overlayerOpacity, function(){
                fn.justifyContent();
                fn.popUpContent();
            });
        },
        justifyContent: function(){
            var top = Math.round((objects.overlayer.height() - objects.content.height()) / 2);
            var left = Math.round((objects.overlayer.width() - objects.content.width()) / 2);

            objects.content.css('top', top);
            objects.content.css('left', left);
        },
        popUpContent: function(){
            objects.content.fadeTo(defaults.speed, defaults.containerOpacity);
        }
    };

    //obj.click(function(){
        fn.popUpOverlayer();
    //});

    objects.overlayer.click(function(){
        objects.content.fadeOut(defaults.speed, function(){
            objects.overlayer.fadeOut(defaults.speed);
        });
    });
    
    /*jQuery('input#back_to_article').click(function(){
        objects.content.fadeOut(defaults.speed, function(){
            objects.overlayer.fadeOut(defaults.speed);
        });
    });*/
}
