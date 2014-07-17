var async = require('async');
var _ = require('lodash');
var models = require(process.cwd() + '/models');
var nconf = require('nconf');

module.exports = function(app) {

  function getBBDefault(callback) {
    console.info('Getting BB default locale');
    var defaultProject = nconf.get('default_project');
    // search for our default project
    models.Project.findOne({
      name: defaultProject.project
    }, function(error, document) {
      // make sure we got something back
      if (document) {
        // search the default BB project
        models.Locale.findOne({
          project: document._id,
          isDefault: true
        }, function(error, document) {
          return callback(null, document);
        });
      } else {
        // cant find any default translations
        return callback(error, null);
      }
    });
  }

  function createTranslations(options, callback) {
    console.info('Creating translations object (DUMMY FUNCTION FOR GOOGLE API TRANSLATOR)');
    var translations = options.sourceTranslations;
    return callback(null, translations);
  }

  function getTranslations(newDocument, callback) {
    console.info('Getting translations for ' + projectId + ' (' + targetLocale + ')');
    var projectId = newDocument.project;
    var targetLocale = newDocument.locale;
    async.waterfall([
      // get base locale
      function(nextStep) {
        // check if this project has a default locale already
        console.info('Getting project default locale');
        models.Locale.findOne({
          project: projectId,
          isDefault: true
        }, function(error, document) {
          // if we didn't get anything back we need to search for BB default
          if (!document) {
            // set our new document as the default
            newDocument.isDefault = true;
            getBBDefault(nextStep);
          } else {
            return nextStep(null, document);
          }
        });
      },
      function(baseLocale, nextStep) {
        console.info('Got base locale, now preparing to create translation object', baseLocale._id);
        var options = {
          sourceTranslations: baseLocale.translations,
          sourceLocale: baseLocale.locale,
          targetLocale: targetLocale
        };
        createTranslations(options, function(error, translations) {
          return nextStep(error, translations);
        });
      }
    ], function(error, translations) {
      if (translations) {
        newDocument.translations = translations;
      }
      return callback(error);
    });
  }

  return {
    index: function(req, res) {
      models.Locale.find({}, 'locale project isDefault', function(error, documents) {
        var options = {
          path: 'project',
          select: 'name'
        };
        models.Locale.populate(documents, options, function(error, documents) {
          return res.send(documents);
        });
      });
    },

    show: function(req, res) {
      // check for locale id
      if (!req.params.localeId) {
        return res.send(500, 'no locale id');
      }
      // get locale
      models.Locale.findById(req.params.localeId, 'locale translations isDefault', function(error, document) {
        if (error) {
          return res.send(500, error);
        }
        return res.send(document);
      });
    },

    create: function(req, res) {
      var document = {
        project: req.body.project,
        locale: req.body.locale
      };
      // check for required fields
      if (!document.locale || !document.project) {
        return res.send(400, 'missing data');
      }
      console.info('Preparing to create locale: ' + document.locale);
      getTranslations(document, function(error) {
        console.info('Got translations: ', _.size(document.translations));
        // create locale
        models.Locale.create(document, function(error, document) {
          if (error) {
            return res.send(500, error);
          }
          console.info('Created new locale');
          return res.send(201, document);
        });
      });

    },

    update: function(req, res) {
      var document = req.body;
      var conditions = {
        _id: req.params.localeId
      };
      // check for locale id
      if (!conditions._id) {
        return res.send(400, 'no locale id');
      }
    },

    remove: function(req, res) {
      // check for locale id
      if (!req.params.localeId) {
        return res.send(400, 'no locale id');
      }
      // remove
      models.Locale.findByIdAndRemove(req.params.localeId, function(error) {
        if (error) {
          return res.send(500, error);
        }
        return res.send(204);
      });
    }

  };
};
