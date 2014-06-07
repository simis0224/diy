var _ = require('lodash');
var mongoose = global.mongoose;

var generateSchema = function(fields) {
  var schema = {};
  _.forEach(fields, function(field) {
    schema[field.name] = field.type;
  });
  return schema;
}

var generateModel = function(entityName, fields) {

  var schema = generateSchema(fields);

  var modelSchema = mongoose.Schema(schema);

  var Model = mongoose.model(entityName, modelSchema);
  Model.fields = fields;

  return Model;
}

module.exports.generateModel = generateModel;