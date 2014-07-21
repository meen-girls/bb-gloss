Translator.KeysView = Ember.View.extend({
  didInsertElement: function() {
    this.$().find('h4').on('click', function(e) {
      var self = $(this);
      Ember.$(this).next('ul').toggle();
    });
    this.$().find('a').on('click', function(e) {
      Ember.$('body, html').animate({
        scrollTop: 0
      }, 300);
    });
  },
  showLanguages: function() {
    return (this.get('controller.availableLanguages').length > 0);
  }.property('controller.availableLanguages')
});