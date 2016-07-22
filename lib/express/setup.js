var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express = require('express');

var routes = require('./routes');

module.exports = (app) => {
  // app.set('views', path.join(__dirname, 'views'));
  // app.set('view engine', 'html');
  app.set('json spaces', 2);

  // app.use(favicon(__dirname + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', routes);

  /// catch 404 and forward to error handler
  app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
  });

  /// error handlers

  // development error handler
  // will print stacktrace

  if (app.get('env') === 'development') {
      app.use(function(err, req, res, next) {
          res.status(err.status || 500)
             .send({
              message: err.message,
              error: err,
          });
      });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
      res.status(err.status || 500)
        .send({
          message: err.message,
          error: {},
        });
  });

};
