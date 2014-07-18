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

    return newArray;
  }.property('content.translations')

});