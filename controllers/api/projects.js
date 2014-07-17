var pathval = require('pathval');
var _ = require('lodash');
var models = require(process.cwd() + '/models');
var helpers = require(process.cwd() + '/lib/helpers');

function getProjectKeys(locales, callback) {
  var keys = [];
  _.forEach(locales, function(locale) {
    helpers.iterateObject(locale.translations, function(key, path, value) {
      // use path, it is the whole path through the object tree
      keys.push(path);
    });
  });
  // rid dupes and any null values
  keys = _.chain(keys).uniq().compact().value();
  callback(null, keys);
}

function getTranslationsForKey(key, locales) {
  var translations = _.map(locales, function(locale) {
    return {
      _id: locale._id,
      name: locale.locale,
      value: pathval.get(locale.translations, key)
    };
  });
  return translations;
}

function getKeyBasedTranslations(locales, callback) {
  getProjectKeys(locales, function(error, keys) {
    var results = _.map(keys, function(key) {
      return {
        key: key,
        translations: getTranslationsForKey(key, locales)
      };
    });
    return callback(error, results);
  });
}

module.exports = function(app) {

  return {
    index: function(req, res) {
      models.Project.find({}, 'name', function(error, documents) {
        return res.send(documents);
      });
    },

    show: function(req, res) {
      // check for project id
      if (!req.params.projectId) {
        return res.send(500, 'no project id');
      }
      // get project
      models.Project.findById(req.params.projectId, 'name', function(error, document) {
        if (error) {
          return res.send(500, error);
        }
        return res.send(document);
      });
    },

    create: function(req, res) {
      var document = {
        name: req.body.name,
        client: req.body.client
      };
      // check for required fields
      if (!document.name || !document.client) {
        return res.send(400, 'missing data');
      }
      // create
      models.Project.create(document, function(error, document) {
        if (error) {
          return res.send(500, error);
        }
        return res.send(201, document);
      });
    },

    update: function(req, res) {
      var document = req.body;
      var conditions = {
        _id: req.params.projectId
      };
      // check for project id
      if (!conditions._id) {
        return res.send(400, 'no project id');
      }
      // update
      models.Project.update(conditions, document, function(error) {
        if (error) {
          return res.send(500, error);
        }
        return res.send(200);
      });
    },

    remove: function(req, res) {
      // check for project id
      if (!req.params.projectId) {
        return res.send(400, 'no project id');
      }
      // remove
      models.Project.findByIdAndRemove(req.params.projectId, function(error) {
        if (error) {
          return res.send(500, error);
        }
        return res.send(204);
      });
    },

    locales: function(req, res) {
      var conditions = {};
      // check for project id
      if (!req.params.projectId) {
        return res.send(400, 'no project id');
      }
      // add project to conditions
      conditions.project = req.params.projectId;
      // get all locales for this project
      models.Locale.find(conditions, 'locale translations', function(error, documents){
        if (error) {
          return res.send(500, error);
        }
        return res.send(documents);
      });
    },

    locale: function(req, res) {
      var conditions = {};
      // check for project id and locale
      if (!req.params.projectId || !req.params.locale) {
        return res.send(400, 'no project id and/or locale');
      }
      // add project and locale to conditions
      conditions.project = req.params.projectId;
      conditions.locale = req.params.locale;
      models.Locale.findOne(conditions, 'locale translations', function(error, document) {
        if (error) {
          return res.send(500, error);
        }
        return res.send(document);
      });
    },

    keys: {
      index: function(req, res) {
        var conditions = {};
        // check for project id
        if (!req.params.projectId) {
          return res.send(400, 'no project id');
        }
        // add project to conditions
        conditions.project = req.params.projectId;
        // get all locales for this project
        models.Locale.find(conditions, 'locale translations', function(error, locales){
          if (error) {
            return res.send(500, error);
          }
          getKeyBasedTranslations(locales, function(error, results) {
            return res.send(results);
          });
        });
      },

      update: function(req, res) {
        var conditions = {
          project: req.params.projectId,
          _id: req.body._id
        };
        var body = {
          key: req.body.key,
          value: req.body.value
        };
        // check for project id
        if (!body.key || !req.params.projectId) {
          return res.send(400, 'missing data');
        }
        // we need to get the translations object for this locale
        models.Locale.findOne(conditions, 'locale translations', function(error, locale) {
          if (!locale || error) {
            return res.send(500, 'unable to find locale for this project');
          }
          if (!pathval.get(locale.translations, body.key, body.value)) {
            return res.send(500, 'key does not exist for this locale');
          }
          pathval.set(locale.translations, body.key, body.value);
          locale.markModified('translations');
          locale.save(function(error, locale) {
            if (error) {
              return res.send(500, error);
            }
            return res.send(200);
          });
        });
      }
    }
  };
};
