module.exports = function(app) {
  return {
    clients: require('./clients')(app),
    projects: require('./projects')(app),
    locales: require('./locales')(app),
    translate: require('./translate')(app)
  };
};
