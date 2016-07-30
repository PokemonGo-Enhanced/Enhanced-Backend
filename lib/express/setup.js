const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const routes = require('./routes');
const API = require('../api');
const serve = require('serve-static');

module.exports = app => {
  app.locals.api = new API(app);
  app.set('json spaces', 2);
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));

  app.use(serve(path.join(process.cwd(), process.env.PUBLIC_ASSETS || 'public')));
  app.use('/', routes);

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    res
      .status(err.status || 500)
      .json({
        message: err.message,
        error: (app.get('env') === 'development') ? err : {},
      });
  });
};
