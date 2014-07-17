var _ = require('lodash');

var iterateObject = function(obj, path, callback) {
  if (typeof path === 'function') {
    callback = path;
    path = null;
  }
  _.forEach(obj, function(value, key) {
    var currentPath;
    if (_.isArray(obj)) {
      currentPath = path + '[' + key + ']';
    } else {
      currentPath = path ? path + '.' + key : key;
    }
    if (value && _.isArray(value)) {
      _.forEach(value, function(item, index) {
        var tempPath = currentPath + '[' + index + ']';
        iterateObject(item, tempPath, callback);
      });
    } else if (value && _.isObject(value)) {
      iterateObject(value, currentPath, callback);
    } else {
      callback(key, currentPath, value);
    }
  });
};

module.exports = {
  iterateObject: iterateObject
};
