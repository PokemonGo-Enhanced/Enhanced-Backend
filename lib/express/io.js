const debug = require('debug')('enhanced:io');

module.exports = (app, io) => {
  function emitChange(prop, data) {
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

  // TODO
  // app.locals = new Proxy(app.locals, emitter);
};
