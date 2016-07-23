const debug = require('debug')('enhanced:io');


module.exports = (app, io) => {
  function emitChange(prop, data) {
    io.emit({
      type: 'update',
      payload: {
        property: prop,
        data: data,
      },
    });
  }
  // Not ideal, only works on top-level properties for now
  const emitter = {
    set: (obj, prop, value) => {
      console.log(prop);
      emitChange(prop, value);    
    },
  };

  app.locals = new Proxy(app.locals, emitter);
};
