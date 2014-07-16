// Routes

Translator.Router.map(function() {
  this.resource('client', {path: '/client/:id'}, function() {
    this.route('projects', {path: '/projects'});
  });
  this.resource('project', {path: '/project/:id'}, function() {
    this.route('locales', {path: '/locales'});
    this.route('translation', {path: '/locales/:id'});
  });
});

// Index Route: '/'

Translator.IndexRoute = Ember.Route.extend({
  model: function() {
    var clients = Ember.A();
    var store = this.get('store');
    return Ember.$.getJSON('/api/clients').then(function(data) {
      data.forEach(function(client) {
        clients.pushObject(Translator.Client.create(client));
      });
      return clients;
    });
  }
});


// Client Route - Lists Projects

Translator.ClientRoute = Ember.Route.extend({
  model: function(params) {
    var url  = '/api/clients/' + params.id + '/projects';
    var projects = Ember.A();
    return Ember.$.getJSON(url).then(function(data) {
      data.forEach(function(project) {
        projects.pushObject(Translator.Project.create(project));
      });
      return projects;
    });
  }
});

Translator.ClientProjectsRoute = Ember.Route.extend({
  model: function(params) {
    return this.modelFor('client');
  }
});

// Projects Route - Lists Translations

Translator.ProjectRoute = Ember.Route.extend({
  model: function(params) {
    var url  = '/api/projects/' + params.id + '/locales';
    var locales = Ember.A();
    return Ember.$.getJSON(url).then(function(data) {
      data.forEach(function(locale) {
        locales.pushObject(Translator.Locale.create(locale));
      });
      return locales;
    });
  }
});

Translator.ProjectLocalesRoute = Ember.Route.extend({
  model: function(params) {
    return this.modelFor('project');
  }
});

// Translation Route
