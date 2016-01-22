var AWS = require('aws-sdk');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var LambdaConfig = function () {
  this.config = {};
  this.fetched = false;
};

util.inherits(LambdaConfig, EventEmitter);

LambdaConfig.prototype.fetch = function (opts) {
  var self = this;
  new AWS.S3().getObject({
    Bucket: opts.S3Bucket,
    Key: opts.S3File
  }, function (err, data) {
    if (err) {
      self.emit('error', err);
      return self.emit('handle');
    }

    var fetchedConfig;
    try {
      fetchedConfig = JSON.parse(data.Body.toString());
    } catch (e) {
      self.emit('error', e);
      return self.emit('handle');
    }

    for (var k in fetchedConfig) self.config[k] = fetchedConfig[k];
    self.fetched = true;
    self.emit('ready');
    self.emit('handle');
  });

  return this.config;
};

LambdaConfig.prototype.handler = function (_handler) {
  var self = this;
  return function handleLambda() {
    var handlerSelf = this;
    var handlerArgs = arguments;
    var handle = function () {
      _handler.apply(handlerSelf, handlerArgs);
    };

    if (self.fetched) {
      handle();
    } else {
      self.on('handle', handle);
    }
  };
};

module.exports = new LambdaConfig();
