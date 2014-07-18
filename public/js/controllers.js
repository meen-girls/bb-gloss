Translator.ApplicationController = Ember.Controller.extend({
  pid: null
});

Translator.KeysController = Ember.ObjectController.extend({
  keys: function() {
    var ar = this.get('content.translations');
    var tranName = '';
    var newArray = [];
    var obj = {};

    for (var i = 0; i < ar.length; i++) {
      var dataSplit = ar[i].key.split('.');
      var newName = dataSplit[0];
      if (tranName !== newName) {
        //Only run this if it's gone through the program
        if (tranName !== '') {
          newArray.push(obj);
        }

        tranName = newName;
        obj = {keys: []};
        obj.name = tranName;
      }

      obj.keys.push(ar[i]);
      // Have to do it for the last one in the array
      if (i === ar.length-1) {
        newArray.push(obj);
      }
    }

    return newArray.compact();
  }.property('content.translations'),
  selectedLanguage: 'en-US',
  selectedLanguageDidChange: function() {
    console.log(this.get('selectedLanguage'));
  }.observes('selectedLanguage'),
  availableLanguages: function() {
    var controller = this;
    return Translator.Languages.filter(function(item) {
      return Ember.$.inArray(item, controller.get('existingLanguages')) === -1;
    });
  }.property(Translator.Languages),
  existingLanguages: function() {
    var firstKey = this.get('content.translations')[0];
    return firstKey.get('translations').map(function(item) {
      return item.name;
    });
  }.property('content.translations'),
  actions: {
    createNewLanguage: function() {

    }
  }

});

Translator.KeysKeyController = Ember.ObjectController.extend({
  needs: ['application'],
  pid: Ember.computed.alias('controllers.application.pid'),
  init: function() {
    console.log(this.get('pid'));
  }
});
