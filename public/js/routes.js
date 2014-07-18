// Routes

Translator.Router.map(function() {
  this.resource('clients', {path: '/'}, function() {
    this.resource('client', {path: '/client/:cid'}, function() {
      this.resource('project', {path: '/project'}, function() {
        this.route('keys', {path: '/:pid'});
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
Translator.ProjectKeysRoute = Ember.Route.extend({
  renderTemplate: function() {
    console.log('sadf');
    this.render('projectKeys');
  },
  model: function(params) {
    var url  = '/api/projects/' + params.pid + '/keys';
    var keys = Ember.A();
    return Ember.$.getJSON(url).then(function(data) {
      console.log(data);
      data.forEach(function(key) {
        keys.pushObject(Translator.Locale.create(key));
      });
      return keys;
    });
  }
});