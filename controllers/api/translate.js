var async = require('async');
var _ = require('lodash');
var models = require(process.cwd() + '/models');
var nconf = require('nconf');
var helpers = require(process.cwd() + '/lib/helpers');
var request = require('request');
var pathval = require('pathval');

module.exports = function(app) {

  function createTranslations(options, callback) {
    var translations = options.sourceTranslations;
    var sourceLang = options.sourceLang.split('-')[0];
    var targetLang = options.targetLang.split('-')[0];
    var keysToIgnore = nconf.get('ignore_keys');
    var limit = 0;
    var pathsToTranslate = helpers.deepMap(translations, function(key, path, value){
      limit++;
      if (!_.contains(keysToIgnore, key) && !_.isBoolean(value)) {
        return {
          key: key,
          path: path,
          value: value
        };
      }
    });
    async.each(pathsToTranslate, function(item, nextPath) {
      request({
        url: nconf.get('google_api').url,
        qs: {
          key: nconf.get('google_api').key,
          source: sourceLang,
          target: targetLang,
          q: item.value
        },
        json: true
      }, function(error, response, body) {
        if (body && body.data && body.data.translations) {
          var translation = body.data.translations[0].translatedText;
          pathval.set(translations, item.path, translation);
        }
        return nextPath(null);
      });
    }, function(error) {
      console.info('Creating translations object');
      return callback(null, translations);
    });
  }

  return function(req, res, next) {
    var options = {
      sourceTranslations: req.body,
      sourceLang: req.params.source,
      targetLang: req.params.destination
    };

    createTranslations(options, function(error, translations) {
      if (error) return next(error);
      return res.send(translations);
    });
  };

};
