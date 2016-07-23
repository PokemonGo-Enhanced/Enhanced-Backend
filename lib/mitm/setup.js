const MITM = require('pokemon-go-mitm');
const debug = require('debug')('mitm:setup');
const _ = require('lodash');
const config = require('../config');
const mitmHandlers = require('./handlers');
const haversine = require('haversine');

module.exports = app => {
  // Set up the MITM
  const mitmServer = new MITM({
    port: config.proxy.port,
  });

  app.locals.mitm = mitmServer;

  // Check the handlers folder
  mitmHandlers.forEach(handler => handler(mitmServer, app));

  // Update position on each request, as well as auth info
  mitmServer.addRequestEnvelopeHandler((_data, ctx) => {
    const data = _.cloneDeep(_data);
    const pos = {};
    pos.latitude = data.latitude;
    pos.longitude = data.longitude;
    pos.altitude = data.altitude;

    app.locals.player.updateLocation(pos);

    const authInfo = data.auth_info;
    if (authInfo) {
      app.locals.authInfo = authInfo;
    }

    const authTicket = data.auth_ticket;
    if (authTicket) {
      app.locals.authTicket = authTicket;
    }

    app.locals.apiEndpoint = ctx.url;
  });

  // mitmServer.addRequestHandler('*', (data, action) => {
  //   console.log('REQUEST ' + action);
  // });
  // mitmServer.addResponseHandler('*', (data, action) => {
  //   console.log('RESPONSE ' + action)
  // });
};
