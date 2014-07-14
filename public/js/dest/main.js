var Translator = Ember.Application.create();

// Routes

Translator.Router.map(function() {
  this.route('index', {path: '/'});
});

// Index Route: '/'

Translator.IndexRoute = Ember.Route.extend({
  model: function() {
    return this.get({
      test: 'Hello World'
    });
  }
});
