var models = require(process.cwd() + '/models');

module.exports = function(app) {
  return {
    index: function(req, res) {
      models.Client.find({}, 'name', function(error, documents) {
        return res.send(documents);
      });
    },

    show: function(req, res) {
      // check for client id
      if (!req.params.clientId) {
        return res.send(400, 'no client id');
      }
      // get client
      models.Client.findById(req.params.clientId, 'name', function(error, document) {
        if (error) {
          return res.send(500, error);
        }
        return res.send(document);
      });
    },

    create: function(req, res) {
      var document = {
        name: req.body.name
      };
      // check for required fields
      if (!document.name) {
        return res.send(400, 'missing data');
      }
      // create
      models.Client.create(document, function(error, document) {
        if (error) {
          return res.send(500, error);
        }
        return res.send(201, document);
      });
    },

    update: function(req, res) {
      var document = {
        name: req.body.name
      };
      var conditions = {
        _id: req.params.clientId
      };
      // check for client id
      if (!conditions._id) {
        return res.send(400, 'no client id');
      }
      // update
      models.Client.update(conditions, document, function(error) {
        if (error) {
          return res.send(500, error);
        }
        return res.send(200);
      });
    },

    remove: function(req, res) {
      // check for client id
      if (!req.params.clientId) {
        return res.send(400, 'no client id');
      }
      // remove
      models.Client.findByIdAndRemove(req.params.clientId, function(error) {
        if (error) {
          return res.send(500, error);
        }
        return res.send(204);
      });
    },

    projects: function(req, res) {
      var conditions = {};
      // check for client id
      if (!req.params.clientId) {
        return res.send(400, 'no client id');
      }
      // add client to conditions
      conditions.client = req.params.clientId;
      // get all projects for this client
      models.Project.find(conditions, 'name', function(error, documents){
        if (error) {
          return res.send(500, error);
        }
        return res.send(documents);
      });
    }
  };
};
