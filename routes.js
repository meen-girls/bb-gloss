exports.registerRoutes = function(app) {
  //Register controllers
  var index = require('./controllers/index')(app);
  var api = require('./controllers/api')(app);

  //Register routes
  app.route('/')
    .get(index.index);

  // API
  // Clients
  app.route('/api/clients')
    .get(api.clients.index)
    .post(api.clients.create);

  app.route('/api/clients/:clientId')
    .get(api.clients.show)
    .put(api.clients.update)
    .delete(api.clients.remove);

  app.route('/api/clients/:clientId/projects')
    .get(api.clients.projects);

  // Projects
  app.route('/api/projects')
    .get(api.projects.index)
    .post(api.projects.create);

  app.route('/api/projects/:projectId')
    .get(api.projects.show)
    .put(api.projects.update)
    .delete(api.projects.remove);

  app.route('/api/projects/:projectId/locales')
    .get(api.projects.locales);

  app.route('/api/projects/:projectId/keys')
    .get(api.projects.keys.index)
    .put(api.projects.keys.update);

  app.route('/api/projects/:projectId/locales/:locale')
    .get(api.projects.locale);

  // Locales
  app.route('/api/locales')
    .get(api.locales.index)
    .post(api.locales.create);

  app.route('/api/locales/:localeId')
    .get(api.locales.show)
    .put(api.locales.update)
    .delete(api.locales.remove);

  app.route('/api/translate/:source/:destination')
    .post(api.translate);
};
