Translator.KeysView = Ember.View.extend({
  didInsertElement: function() {
    this.$().find('h4').on('click', function(e) {
      var self = $(this);
      $(this).next('ul').toggle();
    });
  },
  showLanguages: function() {
    return (this.get('controller.availableLanguages').length > 0);
  }.property('controller.availableLanguages')
});