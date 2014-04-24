var _ = require("lodash");

module.exports = Base;

function Base () {
  this._data = {};
  this._collections = {};
  this._db = {};
}

Base.prototype.insert = function(callback) {
  this.getCollection().insert(this.getData(), {}, function(err, result){
    if(err) {
      console.log(err);
    }
    callback();
  });
}

Base.prototype.update = function(query, callback) {
  this.getCollection().update(query, { $set: this.getData() }, {}, function(err, result){
    if(err) {
      console.log(err);
    }
    callback();
  });
}

Base.prototype.get = function(query, callback) {
  this.getCollection().find(query || {}).toArray(callback);
}

Base.prototype.setData = function(data, isCreate) {
  if (!data) {
    return;
  }
  that = this;
  Object.keys(data).forEach(function(key) {
    if (key != '_id' && _.contains(that.getFields(), key)) {
      that._data[key] = data[key];
    }
  });
  if (isCreate) {
    this._data.createdDate = new Date();
  }
  this._data.lastUpdatedDate = new Date();
}

Base.prototype.getData = function() {
  return this._data;
}

Base.prototype.getCollection = function(){
  var collectionName = this.getCollectionName();
  if(!_.contains(this._collections, collectionName)) {
    this._collections[collectionName] = this._db.collection(collectionName);
  }
  return this._collections[collectionName];
}

Base.prototype.setDB = function(db) {
  this._db = db;
}

/**
 * Methods below should implement in sub class
 **/
Base.prototype.getCollectionName = function() {}

Base.prototype.getFields = function() {}