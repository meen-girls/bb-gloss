var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  locale: {
    type: String,
    required: true,
    trim: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'project',
    required: true
  },
  translations: Schema.Types.Mixed,
  isDefault: Boolean
});

// create the model
var locale = mongoose.model('locale', schema);

module.exports.Locale = locale;
