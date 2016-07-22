const proto = require('pokemongo-protobuf');
const mitm = require('pokemon-go-mitm');
const haversine = require('haversine');
const rand = require('randgen');
const util = require('util');

const config = require('../config');
const Player = require('../player');
const api = require('./api');
const mitmHandlers = require('./handlers');

module.exports = (app) => {
  // Set up the MITM
  var mitmServer = new mitm({
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
  mitmHandlers.forEach(handler => {
    handler(mitmServer);
  });

  // Update position on each request, as well as auth info
  mitmServer.addRequestEnvelopeHandler((data, ctx) => {
    data = _.cloneDeep(data);
    var pos = {};
    pos.latitude = data.latitude;
    pos.longitude = data.longitude;
    pos.altitude = data.altitude;

    app.locals.player.updateLocation(pos);

    var authInfo = data.auth_info;
    if (authInfo) {
      app.locals.authInfo = authInfo;
    }
    var authTicket = data.auth_ticket;
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

  mitmServer.addResponseHandler('GetMapObjects', (data, action) => {
    app.locals.mapCells = data.map_cells;

    data.map_cells.forEach((cell) => {
      if (!_.isEmpty(cell.catchable_pokemons)) {
        app.locals.cathablePokemon = cell.catchablePokemons;
        console.log(cell.catchable_pokemons);
      }
    });
  });
}

