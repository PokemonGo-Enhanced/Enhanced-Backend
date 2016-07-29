const debug = require('debug')('enhanced:io');
const state = require('../state');
const o = require('observed');
const _ = require('lodash');
require('object.observe');

module.exports = (app, io) => {
  function emitChange(prop, data) {
    debug('Emitting update for ' + prop);
    io.emit({
      type: 'update',
      payload: {
        data,
        property: prop,
      },
    });
  }
  // Not ideal, only works on top-level properties for now
  const emitter = {
    set: (obj, prop, value) => {
      debug('setting %s', prop);
      emitChange(prop, value);
      obj[prop] = value;
    },
  };

  const ee = o(state);
  _.keys(state).forEach(prop => {
    ee.on('update ' + prop, desc => {
      emitChange(prop, state[prop]);
    });
  })
};
