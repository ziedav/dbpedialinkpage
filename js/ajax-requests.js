
//New Database
var Database = function(){
    this.controllerPath = '/controller.php';
};
//Teil 1 - Wörter aktivieren
Database.prototype.word_activate = function(word){
    var that = this;
   
    var data = {
        task : 'word_activate',
        word : word
    };
    jQuery.ajax({
        url: that.controllerPath,
        data: data,
        type: 'get',
        success: 
                function(){
                    alert("Update successful");
                }
    });
};

Database.prototype.listen_word_activate = function(){
    var that = this;  
    jQuery('#word_active_run').click(function(){
		
        var word = jQuery('#word_activate').val();
        that.word_activate(word);
    });
};

//Teil 2 - Wörter deaktivieren
Database.prototype.word_deactivate = function(word){
    var that = this;
   
    var data = {
        task : 'word_deactivate',
        word : word
    };
    jQuery.ajax({
        url: that.controllerPath,
        data: data,
        type: 'get',
        success: 
                function(textNodes){
                    alert("Update successful");
                }
    });
};

Database.prototype.listen_word_deactivate = function(){
    var that = this;  
    jQuery('#word_deactive_run').click(function(){
        var word = jQuery('#word_deactivate').val();
        that.word_deactivate(word);
    });
};

//Teil 3 - Benutzer zu Admin machen
Database.prototype.admin_activate = function(benutzer){
    var that = this;
   
    var data = {
        task : 'admin_activate',
        benutzer : benutzer
    };
    jQuery.ajax({
        url: that.controllerPath,
        data: data,
        type: 'get',
        success: 
                function(textNodes){
                    alert("User is now Admin");
                }
    });
};

Database.prototype.listen_admin_activate = function(){
    var that = this;  
    jQuery('#admin_activate_run').click(function(){
		
        var benutzer = jQuery('#admin_activate').val();
        that.admin_activate(benutzer);
    });
};

//Teil 4 - Benutzer löschen
Database.prototype.user_delete = function(benutzer){
    var that = this;
   
    var data = {
        task : 'user_delete',
        benutzer : benutzer
    };
    jQuery.ajax({
        url: that.controllerPath,
        data: data,
        type: 'get',
        success: 
                function(textNodes){
                    alert("User deleted");
                }
    });
};

Database.prototype.listen_user_delete = function(){
    var that = this;  
    jQuery('#user_delete_run').click(function(){
		
        var benutzer = jQuery('#user_delete').val();
        that.user_delete(benutzer);
    });
};

//Die meistgesuchten Woerter anzeigen
Database.prototype.show_common_words = function(){
    var that = this;
   
    var data = {
        task : 'show_common_words',
    };
    jQuery.ajax({
        url: that.controllerPath,
        data: data,
        type: 'get',
        success: 
                function(textNodes){
					jQuery('#common_words').empty();
					jQuery('#common_words').append('<b>Wort, Anzahl </b><br/>');
					jQuery('#common_words').append(textNodes);
                }
    });
};

Database.prototype.listen_show_common_words = function(){
    var that = this;  
    jQuery('#show_common_words_run').click(function(){
        that.show_common_words();
    });
};

//Die aktivsten Benutzer anzeigen
Database.prototype.show_active_users = function(){
    var that = this;
   
    var data = {
        task : 'show_active_users',
    };
    jQuery.ajax({
        url: that.controllerPath,
        data: data,
        type: 'get',
        success: 
                function(textNodes){
					jQuery('#common_words').empty();
					jQuery('#common_words').append('<b>Benutzer, Seitenaufrufe </b><br/>');
					jQuery('#common_words').append(textNodes);
                }
    });
};

Database.prototype.listen_show_active_users = function(){
    var that = this;  
    jQuery('#show_active_users_run').click(function(){
        that.show_active_users();
    });
};

//Meist betrachteten Internetseiten anzeigen lassen
Database.prototype.show_most_viewed_url = function(){
    var that = this;
   
    var data = {
        task : 'show_most_viewed_url',
    };
    jQuery.ajax({
        url: that.controllerPath,
        data: data,
        type: 'get',
        success: 
                function(textNodes){
					jQuery('#common_words').empty();
					jQuery('#common_words').append('<b>Internetseite, Aufrufe</b><br/>');
					jQuery('#common_words').append(textNodes);
                }
    });
};

Database.prototype.listen_show_most_viewed_url = function(){
    var that = this;  
    jQuery('#show_most_viewed_url_run').click(function(){
        that.show_most_viewed_url();
    });
};

//Die 10 letzten Anfragen des Users anzeigen (mit Datum)
Database.prototype.show_users_last_url = function(user){
    var that = this;
   
    var data = {
        task : 'show_users_last_url',
		user : user
    };
    jQuery.ajax({
        url: that.controllerPath,
        data: data,
        type: 'get',
        success: 
                function(textNodes){
					jQuery('#common_words').empty();
					jQuery('#common_words').append('<b>Internetseite</b><br/>');
					jQuery('#common_words').append(textNodes);
                }
    });
};

Database.prototype.listen_show_users_last_url = function(user){
	console.log(user);
    var that = this;  
    jQuery('#show_users_last_url_run').click(function(){
        that.show_users_last_url(user);
    });
};