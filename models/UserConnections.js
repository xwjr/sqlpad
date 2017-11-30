var fs = require('fs')
var path = require('path')
var Joi = require('joi')
var db = require('../lib/db.js')
var config = require('../lib/config.js')
var Connection = require('./Connection.js')
const DB_PATH = config.get('dbPath')
var rimraf = require('rimraf')
var xlsx = require('node-xlsx')
var json2csv = require('json2csv')

var schema = {
  _id: Joi.string().optional(), // will be auto-gen by nedb
  connectionId: Joi.string().required(), // unique, manually provided
  name: Joi.string().optional(), // item and associated cache files are removed on expiration
  userId: Joi.string().required(), // used for file names if a file is downloaded
  createdDate: Joi.date().default(new Date(), 'time of creation'),
  modifiedDate: Joi.date().default(new Date(), 'time of modification')
}

var UserConnections = function UserConnections(data) {
  this._id = data._id
  this.connectionId = data.connectionId
  this.name = data.name
  this.userId = data.userId
  this.createdDate = data.createdDate
  this.modifiedDate = data.modifiedDate
}

UserConnections.prototype.save = function UserConnectionsSave(callback) {
  var self = this
  this.modifiedDate = new Date()
  var joiResult = Joi.validate(self, schema)
  if (joiResult.error) return callback(joiResult.error)
  if (self._id) {
    db.userConnections.update(
      { _id: self._id },
      joiResult.value,
      { upsert: true },
      function(err) {
        if (err) return callback(err)
        console.log(self._id)
        return UserConnections.findOneById(self._id, callback)
      }
    )
  } else {
    db.userConnections.insert(joiResult.value, function(err, newDoc) {
      if (err) return callback(err)
      console.log(newDoc)
      if (err) return callback(err)
      return callback(null, new UserConnections(newDoc))
    })
  }
}

/*  Query methods
============================================================================== */

UserConnections.findAll = function UserConnectionsFindAll(callback) {
  db.userConnections
    .find({})
    .sort({ modifiedDate: 1 })
    .exec(function(err, docs) {
      if (err) return callback(err)
      var userConnections = docs.map(function(doc) {
        return new UserConnections(doc)
      })
      callback(err, userConnections)
    })
}

UserConnections.findByUserId = function UserFindOneById(id, callback) {
  db.userConnections.find({ userId: id }).exec(function(err, docs) {
    if (err) return callback(err)
    var userConnections = docs.map(function(doc) {
      return new UserConnections(doc).connectionId
    })
    db.connections
      .find({
        _id: {
          $in: userConnections
        }
      })
      .exec(function(err, docs) {
        var connections = docs.map(function(doc) {
          return new Connection(doc)
        })
        return callback(err, connections)
      })
  })
}

UserConnections.findOneById = function UserFindOneById(id, callback) {
  db.userConnections.findOne({ _id: id }).exec(function(err, doc) {
    if (err) return callback(err)
    if (!doc) return callback()
    return callback(err, new User(doc))
  })
}
UserConnections.findOneByConnectionId = function UserFindOneById(
  connectionId,
  userId,
  callback
) {
  db.userConnections
    .findOne({ connectionId: connectionId, userId: userId })
    .exec(function(err, doc) {
      if (err) return callback(err)
      if (!doc) return callback()
      return callback(err, new UserConnections(doc))
    })
}

UserConnections.removeOneByName = function UserFindOneById(
  userId,
  name,
  callback
) {
  db.userConnections.remove({ userId: userId, name: name }, callback)
}
module.exports = UserConnections
