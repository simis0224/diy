var Enum = require('enum');
var labels = require('../labels/enumLabels');
var _ = require('lodash');

var categoryEnum = new Enum({
  'Cooking': {
    dbValue: 0,
    label: labels.categories.cooking
  },
  'Home': {
    dbValue: 1,
    label: labels.categories.home
  },
  'Handcraft': {
    dbValue: 2,
    label: labels.categories.handcraft
  },
  'Baking': {
    dbValue: 3,
    label: labels.categories.baking
  },
  'Gardening': {
    dbValue: 4,
    label: labels.categories.gardening
  },
  'Pets': {
    dbValue: 5,
    label: labels.categories.pets
  },
  'Automobile': {
    dbValue: 6,
    label: labels.categories.automobile
  },
  'Technology': {
    dbValue: 7,
    label: labels.categories.technology
  }
});

var dbValueToEnumMap;

// TODO: should have this ready when app starts
var getEnumByDbValue = function (dbValue) {
  if(!dbValueToEnumMap) {
    dbValueToEnumMap = {};
    _.forEach(categoryEnum.enums, function (item) {
      dbValueToEnumMap[item.value.dbValue] = item;
    });
  }
  return dbValueToEnumMap[dbValue];
}

module.exports = categoryEnum;
module.exports.getEnumByDbValue = getEnumByDbValue;