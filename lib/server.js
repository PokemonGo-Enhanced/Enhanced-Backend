const express = require('express');
const setupExpress = require('./express/setup');
const setupMitm = require('./mitm/setup');
const fs = require('fs');
const debug = require('debug')('enhanced:server');
const _ = require('lodash');

// global for now
const app = express();

const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env === 'development';

// do serialization
if (env === 'development') {
  try {
    app.locals = JSON.parse(fs.readFileSync('.app_locals'));
    debug('restored locals');
  } catch (e) {
    debug('failed to deserialize locals', e.message);
  }

  const gracefulStop = (signal) => () => {
    debug('serializing locals');

    try {
      fs.writeFileSync('.app_locals', JSON.stringify(_.omit(app.locals, ['api'])));
    } catch (e) {
      debug('failed to serialize app state', e.message);
    }

    process.kill(process.pid, signal);
  };

  process.once('SIGUSR2', gracefulStop('SIGUSR2'));
  process.once('SIGINT', gracefulStop('SIGINT'));
}

setupExpress(app);
setupMitm(app);

module.exports = app;
