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
      // TODO: CREATE AN ASYNC WATERFALL THAT WILL CHECK FOR DEFAULT LOCALE AND POPULATE TRANSLATIONS
      // create
      models.Locale.create(document, function(error, document) {
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
    }

  };
};
