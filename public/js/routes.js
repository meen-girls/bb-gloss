// Routes

Translator.Router.map(function() {
  this.resource('clients', {path: '/'}, function() {
    this.resource('client', {path: '/client/:cid'}, function() {
      this.resource('project', {path: '/project'}, function() {
        this.route('locales', {path: '/:pid'});
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
Translator.ProjectLocalesRoute = Ember.Route.extend({
  renderTemplate: function() {
    this.render('projectLocales');
  },
  model: function(params) {
    // Dummy Data
    return [{
      key:'home.footer',
      translation: [{
        _id: 'Unique Id',
        name: 'en-US',
        value: 'Home Footer'
      }]
     },
     {
      key:'home.header',
      translation: [{
        _id: 'Unique Id',
        name: 'en-US',
        value: 'Home Header'
      }]
     },
     {
      key:'links.site',
      translation: [{
        _id: 'Unique Id',
        name: 'en-US',
        value: 'Site'
      }]
     },
     {
      key:'links.about',
      translation: [{
        _id: 'Unique Id',
        name: 'en-US',
        value: 'About'
      }]
     },
     {
      key:'links.contact',
      translation: [{
        _id: 'Unique Id',
        name: 'en-US',
        value: 'Contact'
      }]
     },
     {
      key:'links.home',
      translation: [{
        _id: 'Unique Id',
        name: 'en-US',
        value: 'Home'
      }]
     },
     {
      key:'checkout.header',
      translation: [{
        _id: 'Unique Id',
        name: 'en-US',
        value: 'Checkout Header'
      }]
     },
     {
      key:'checkout.footer',
      translation: [{
        _id: 'Unique Id',
        name: 'en-US',
        value: 'Checkout Footer'
      }]
     },
     {
      key:'cart.header',
      translation: [{
        _id: 'Unique Id',
        name: 'en-US',
        value: 'Cart Header'
      }]
     },
     {
      key:'cart.footer',
      translation: [{
        _id: 'Unique Id',
        name: 'en-US',
        value: 'Cart Footer'
      }]
     }];

    // Will return an API data in the f
    // var url  = '/api/projects/' + params.pid + '/locales';
    // var locales = Ember.A();
    // return Ember.$.getJSON(url).then(function(data) {
    //   data.forEach(function(locale) {
    //     locales.pushObject(Translator.Locale.create(locale));
    //   });
    //   return locales;
    // });
  }
});