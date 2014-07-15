var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'client',
    required: true
  },
  locales: [{
    type: Schema.Types.ObjectId,
    ref: 'locale'
  }]
});

// create the model
var project = mongoose.model('project', schema);

module.exports.Project = project;
