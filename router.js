exports.registerRoutes = function(app) {
  //Register controllers
  var index = require('./controllers/index')(app);

  //Register routes
  app.get('/', index.index);
};
