
/*
 * GET home page.
 */
var _     = require('lodash');

module.exports = function(app) {
  return {
    index: function(req, res) {
      return res.render('index.html', {});
    }
  };
};
