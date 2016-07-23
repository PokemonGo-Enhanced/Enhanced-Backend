const express = require('express');
const fs = require('fs');
const _ = require('lodash');
const setupExpress = require('./express/setup');
const setupIO = require('./express/io');
const setupMitm = require('./mitm/setup');
const debug = require('debug')('enhanced:server');
const http = require('http');
const config = require('./config');
const io = require('socket.io')(http);

// global for now
const app = express();

const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env === 'development';

// Set up app.locals listeners first because it replaces the app.locals ref
setupIO(app, io);
setupExpress(app);
setupMitm(app);

// do serialization
if (env === 'development') {
  try {
    // TODO: fix player object deserialization
    app.locals = Object.assign({}, app.locals, JSON.parse(fs.readFileSync('.app_locals')));
    if (app.locals.player) {
      const Player = require('./player');
      app.locals.player = new Player(app.locals.player, app.locals.player.authInfo);
    }
    debug('restored locals');
  } catch (e) {
    debug('failed to deserialize locals', e.message);
  }

  const gracefulStop = (signal) => () => {
    debug('serializing locals');

    try {
      // TODO: fix player object serialization
      fs.writeFileSync('.app_locals', JSON.stringify(_.omit(app.locals, ['api', 'mitm'])));
    } catch (e) {
      debug('failed to serialize app state', e.message);
    }

    process.kill(process.pid, signal);
  };

  process.once('SIGUSR2', gracefulStop('SIGUSR2'));
  process.once('SIGINT', gracefulStop('SIGINT'));
}

if (!module.parent) {
  app.server = http.createServer(app);
  app.server.listen(config.express.port, config.express.host, () => {
    debug('listening on http://%s:%s', config.express.host, config.express.port);
  });
}

module.exports = app;
