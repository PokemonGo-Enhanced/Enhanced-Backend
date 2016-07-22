var express = require('express');
var setupExpress = require('./express/setup');
var setupMitm = require('./mitm/setup');
var lodash = require('lodash');

// global for now
app = express();
_ = lodash;

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

setupExpress(app);
setupMitm(app);

module.exports = app;
