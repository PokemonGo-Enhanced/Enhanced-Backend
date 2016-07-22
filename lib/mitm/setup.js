const MITM = require('pokemon-go-mitm');
const _ = require('lodash');
const config = require('../config');
const Player = require('../player');
const mitmHandlers = require('./handlers');

module.exports = app => {
  // Set up the MITM
  const mitmServer = new MITM({
    port: config.proxy.port,
  });

  app.locals.mitm = mitmServer;
  app.locals.mapCells = []; // not const
  app.locals.authInfo = null;
  app.locals.nearbyPokemons = [];
  app.locals.apiEndpoint = null;
  app.locals.player = new Player();
  app.locals.pokemons = [];
  app.locals.items = {};

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


  // mitmServer.addRequestHandler('GetInventory', (data) => {
  //   var since = new Date(_.toNumber(data.last_timestamp_ms))
  //   console.log('Requesting inventory since', new Date(since))
  // })

  mitmServer.addResponseHandler('GetMapObjects', (data) => {
    app.locals.mapCells = data.map_cells;

    data.map_cells.forEach((cell) => {
      if (!_.isEmpty(cell.catchable_pokemons)) {
        app.locals.cathablePokemon = cell.catchablePokemons;
        // console.log(cell.catchable_pokemons);
      }
    });
  });
};
