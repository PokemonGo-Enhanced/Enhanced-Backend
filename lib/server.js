const express = require('express');
const setupExpress = require('./express/setup');
const setupMitm = require('./mitm/setup');

// global for now
const app = express();

const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env === 'development';

setupExpress(app);
setupMitm(app);

module.exports = app;
