const express = require('express');
const debug = require('debug')('enhanced:server');
const http = require('http');
const socketIO = require('socket.io');

const setupExpress = require('./express/setup');
const setupIO = require('./express/io');
const setupMitm = require('./mitm/setup');
const config = require('./config');
const state = require('./state');

function start(newConfig={}) {
  Object.assign(config, newConfig);

  const app = express();
  app.server = http.createServer(app);
  const io = socketIO(app.server);

  const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env === 'development';

  setupIO(app, io);
  setupExpress(app);
  setupMitm(app);

  if (env === 'development') {
    const gracefulStop = (signal) => () => {
      try {
        state.serialize();
      } catch (e) {
        debug('failed to serialize app state', e.message);
      }

      process.kill(process.pid, signal);
    };

    process.once('SIGUSR2', gracefulStop('SIGUSR2'));
    process.once('SIGINT', gracefulStop('SIGINT'));
  }

  app.server.listen(config.express.port, config.express.host, () => {
    debug('listening on http://%s:%s', config.express.host, config.express.port);
  });
}

module.exports = start;
