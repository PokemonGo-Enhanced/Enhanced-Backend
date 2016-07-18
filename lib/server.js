var express = require('express');
var routes = require('./routes/index');
var setupExpress = require('./express/setup');
var setupMitm = require('./mitm/setup');

// global for now
app = express();

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

setupExpress(app);
setupMitm(app);

module.exports = app;
