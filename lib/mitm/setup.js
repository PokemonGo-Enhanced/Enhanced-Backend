const MITM = require('pokemon-go-mitm');
const _ = require('lodash');
const config = require('../config');
const mitmHandlers = require('./handlers');
const state = require('../state');

module.exports = app => {
  // Set up the MITM
  const mitmServer = new MITM({
    port: config.proxy.port,
  });

  app.locals.mitm = mitmServer;

  // Check the handlers folder
  mitmHandlers.forEach(handler => handler(mitmServer, app));

  // Update position on each request, as well as auth info
  mitmServer.addRequestEnvelopeHandler((data, ctx) => {
    state.location = _.pick(data, ['latitude', 'longitude', 'altitude']);

    const authInfo = data.auth_info;
    if (authInfo) {
      state.authInfo = authInfo;
    }

    const authTicket = data.auth_ticket;
    if (authTicket) {
      state.authTicket = authTicket;
    }

    state.apiEndpoint = ctx.url;
  });

  // mitmServer.addRequestHandler('*', (data, action) => {
  //   console.log('REQUEST ' + action);
  // });
  // mitmServer.addResponseHandler('*', (data, action) => {
  //   console.log('RESPONSE ' + action)
  // });
};
