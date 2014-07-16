var async = require('async');
var _ = require('lodash');
var models = require(process.cwd() + '/models');

module.exports = function(app) {
  return {
    index: function(req, res) {
      models.Locale.find({}, 'locale project', function(error, documents) {
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
      models.Locale.findById(req.params.localeId, 'locale translations', function(error, document) {
        if (error) {
          return res.send(500, error);
        }
        return res.send(document);
      });
    },

    create: function(req, res) {
      var document = {
        project: req.body.project,
        locale: req.body.locale,
        translations: req.body.translations
      };
      // check for required fields
      if (!document.locale || !document.project) {
        return res.send(400, 'missing data');
      }
      // check for default translations for this locale
      async.waterfall([
        // get default translations for this locale
        function(nextStep) {
          models.Project.findOne({ name: 'default' }, function(error, project) {
            models.Locale.findOne({project:project._id}, function(error, locale) {
              return nextStep(null, locale);
            });
          });
        },
        // merge with any translations passed
        function(locale, nextStep) {
          var defaultTranslations = _.cloneDeep(locale.translations);
          var translations = _.merge(defaultTranslations, translations);
          return nextStep(null, translations);
        }
      ], function(error, translations) {
        if (translations) {
          document.translations = translations;
        }
        // create locale
        models.Locale.create(document, function(error, document) {
          if (error) {
            return res.send(500, error);
          }
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
      // check for translations for this locale
      async.waterfall([
        // get translations for this locale
        function(nextStep) {
          if (!document.translations) {
            // we arent updating translations so just skip to next step
            return nextStep(null, null);
          }
          models.Locale.findById(conditions._id, function(error, locale) {
            return nextStep(null, locale);
          });
        },
        // merge with any translations passed
        function(locale, nextStep) {
          if (!locale) {
            // no locale was passed, continue to next step
            return nextStep(null, null);
          }
          var currentTranslations = _.cloneDeep(locale.translations);
          var translations = _.merge(currentTranslations, document.translations, function(currentValue, newValue) {
            return _.isArray(currentValue) ? newValue : undefined;
          });
          // remove anything no longer needed
          _.each(translations, function(v, k) {
            if(!v) {
              delete translations[k];
            }
          });
          return nextStep(null, translations);
        }
      ], function(error, translations) {
        if (document.translations && translations) {
          document.translations = translations;
        }
        // update
        models.Locale.update(conditions, document, function(error) {
          if (error) {
            return res.send(500, error);
          }
          return res.send(200);
        });
      });
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
