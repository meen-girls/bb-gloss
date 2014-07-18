// Routes

Translator.Router.map(function() {
  this.resource('clients', {path: '/'}, function() {
    this.resource('client', {path: '/client/:cid'}, function() {
      this.resource('project', {path: '/project'}, function() {
        this.resource('keys', {path: '/:pid'}, function () {
          this.route('key', {path: '/key/:kid'});
        });
      });
    });
  });
});

// Clients Route: '/'

Translator.ClientsRoute = Ember.Route.extend({
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
    var url  = '/api/clients/' + params.cid + '/projects';
    var projects = Ember.A();
    return Ember.$.getJSON(url).then(function(data) {
      data.forEach(function(project) {
        projects.pushObject(Translator.Project.create(project));
      });
      return projects;
    });
  }
});

// Projects Route - Lists Translations
Translator.ProjectRoute = Ember.Route.extend();
Translator.KeysRoute = Ember.Route.extend({
  renderTemplate: function() {
    this.render('keys');
  },
  model: function(params) {
    var url  = '/api/projects/' + params.pid + '/keys';
    var keys = Translator.Keys.create();
    return Ember.$.getJSON(url).then(function(data) {
      data.forEach(function(key) {
        keys.createRecord(key);
      });
      return keys;
    });
  }
});

Translator.KeysKeyRoute = Ember.Route.extend({
  renderTemplate: function() {
    this.render('keysKey');
  },
  model: function(params) {
    var model = this.modelFor('keys').lookup(params.kid);
    return model;
  }
});