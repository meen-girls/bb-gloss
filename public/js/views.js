Translator.KeysView = Ember.View.extend({
  showLanguages: function() {
    console.log((this.get('controller.availableLanguages').length > 0));
    return (this.get('controller.availableLanguages').length > 0);
  }.property('controller.availableLanguages')
});