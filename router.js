exports.registerRoutes = function(app) {
  //Register controllers
  var index = require('./controllers/index')(app);
  var api = require('./controllers/api')(app);

  //Register routes
  app.get('/', index.index);

  // API
  // Clients
  app.get('/api/clients', api.clients.index);
  app.post('/api/clients', api.clients.create);
  app.get('/api/clients/:clientId', api.clients.show);
  app.put('/api/clients/:clientId', api.clients.update);
  app.delete('/api/clients/:clientId', api.clients.remove);
  app.get('/api/clients/:clientId/projects', api.clients.projects);

  // Projects
  app.get('/api/projects', api.projects.index);
  app.post('/api/projects', api.projects.create);
  app.get('/api/projects/:projectId', api.projects.show);
  app.put('/api/projects/:projectId', api.projects.update);
  app.delete('/api/projects/:projectId', api.projects.remove);
  app.get('/api/projects/:projectId/locales', api.projects.locales);
  app.get('/api/projects/:projectId/locales/:locale', api.projects.locale);

  // Locales
  app.get('/api/locales', api.locales.index);
  app.post('/api/locales', api.locales.create);
  app.get('/api/locales/:localeId', api.locales.show);
  app.put('/api/locales/:localeId', api.locales.update);
  app.delete('/api/locales/:localeId', api.locales.remove);

};
