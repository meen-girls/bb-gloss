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
        obj.name = tranName.replace(/_/g, ' ');
      }

      obj.keys.push(ar[i]);
      // Have to do it for the last one in the array
      if (i === ar.length-1) {
        newArray.push(obj);
      }
    }

    return newArray.compact();
  }.property('content.translations'),
  selectedLanguage: null,
  availableLanguages: function() {
    var controller = this;
    return Translator.Languages.filter(function(item) {
      return Ember.$.inArray(item, controller.get('existingLanguages')) === -1;
    });
  }.property('existingLanguages'),
  existingLanguages: function() {
    var firstKey = this.get('content.translations')[0];
    return firstKey.get('translations').map(function(item) {
      return item.name;
    });
  }.property('content.translations'),
  actions: {
    createNewLanguage: function() {
      if (!this.get('selectedLanguage')) return;
      var controller = this;
      var obj = {
        'project': this.get('pid'),
        'locale': this.get('selectedLanguage')
      };
      return new Ember.RSVP.Promise(function(resolve, reject) {
        Ember.$.ajax({
            type : "POST",
            url : "/api/locales/",
            data : obj
        })
        .done(function(data) {
          resolve(data);
        });
      })
      .then(function() {
        window.location.reload();
      });
    }
  }

});

Translator.KeysKeyController = Ember.ObjectController.extend({
  needs: ['application'],
  pid: Ember.computed.alias('controllers.application.pid'),
  kid: null,
  isUpdated: false,
  actions: {
    submitAction: function(params) {
      var controller = this;
      var obj = {
        '_id': params._id,
        'key': this.get('kid'),
        'value': params.value
      };
      return new Ember.RSVP.Promise(function(resolve, reject) {
        Ember.$.ajax({
            type : "PUT",
            url : "/api/projects/" + controller.get('pid') + '/keys',
            data : obj
        })
        .done(function(data) {
          resolve(data);
        });
      })
      .then(function() {
        controller.set('isUpdated', true);
        Ember.run.later(function() {
          controller.set('isUpdated', false);
        }, 2000);
      });
    }
  }
});
