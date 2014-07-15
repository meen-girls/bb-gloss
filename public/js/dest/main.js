var Translator = Ember.Application.create();

// Routes

Translator.Router.map(function() {});

// Index Route: '/'

Translator.IndexRoute = Ember.Route.extend({
  model: function() {
    return {
      test: 'Hello World'
    };
  }
});
