import Orbit from 'orbit/core';
import Evented from 'orbit/evented';

var TransformQueue = function() {
  this.init.apply(this, arguments);
};

TransformQueue.prototype = {
  constructor: TransformQueue,

  init: function(target, options) {
    Orbit.assert('TransformQueue requires Orbit.Promise to be defined', Orbit.Promise);

    Evented.extend(this);

    options = options || {};
    this.autoProcess = options.autoProcess !== undefined ? options.autoProcess : true;

    this.target = target;
    this._queue = [];
    this.processing = false;
  },

  push: function(operation) {
    var _this = this;

//TODO-log    console.log('>>>> TransformQueue', _this.target.id, operation);

    var response = new Orbit.Promise(function(resolve) {
      var transform = {
        resolver: function() {
          var ret = _this.target._transform.call(_this.target, operation);
          if (ret) {
            return ret.then(
              function() {
                resolve();
              }
            );
          } else {
            resolve();
          }
        },
        op: operation
      };

      _this._queue.push(transform);
    });

    if (this.autoProcess) this.process();

    return response;
  },

  process: function() {
    if (!this.processing) {
      var _this = this;

      _this.processing = true;

      var settleEach = function() {
        if (_this._queue.length === 0) {

          _this.processing = false;
          _this.emit('didComplete');
//TODO-log          console.log('---- TransformQueue', _this.target.id, 'EMPTY');

        } else {
          var transform = _this._queue.shift();

//TODO-log          console.log('<<<< TransformQueue', _this.target.id, transform.operation);

          var ret = transform.resolver.call(_this);
          if (ret) {
            return ret.then(
              function(success) {
                settleEach();
              },
              function(error) {
                settleEach();
              }
            );
          } else {
            settleEach();
          }
        }
      };

      settleEach();
    }
  }
};

export default TransformQueue;