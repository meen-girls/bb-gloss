var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'project'
  }]
});

// create the model
var client = mongoose.model('client', schema);

module.exports.Client = client;
