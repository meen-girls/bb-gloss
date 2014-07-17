var mongoose = require('mongoose');
var models = require('./models');
var fs = require('fs');

mongoose.connect('mongodb://test:test@ds043467.mongolab.com:43467/bb-tit');

// data object
var client = {
  name: 'BB'
};
var project = {
  name: 'default'
};
var locale = {
  locale: 'en-US',
  translations: null,
  isDefault: true
};

fs.readFile(__dirname + '/data/en-US.json', 'utf8', function (err, data) {
  if (err) {
    console.log('Error: ' + err);
    prcess.exit();
  }

  locale.translations = JSON.parse(data);

  // create BB client
  models.Client.create(client, function(err, client) {
    if(err) {
      console.log(err);
      process.exit();
    } else {
      console.log('created client: ', client);
      // create BB default project
      project.client = client._id;
      models.Project.create(project, function(err, project) {
        if (err) {
          console.log(err);
          process.exit();
        }
        console.log('created project: ', project);
        // create default locale
        locale.project = project._id;
        models.Locale.create(locale, function(erro, locale) {
          if (err) {
            console.log(err);
            process.exit();
          }
          console.log('created locale: ', locale);
          process.exit();
        });
      });
    }
  });

});
