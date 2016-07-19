const proto = require('pokemongo-protobuf');
const mitm = require('pokemon-go-mitm-node');
const haversine = require('haversine');

const config = require('../config');
const Player = require('../player');

module.exports = (app) => {
  // Set up the MITM
  var mitmServer = new mitm({
    port: config.proxy.port,
  });

  app.locals.mitm = mitmServer;
  app.locals.mapCells = []; // not const
  app.locals.authInfo = null;
  app.locals.nearbyPokemons = [];

  mitmServer.addRequestEnvelopeHandler((data) => {
    var pos = {};
    pos.latitude = data.latitude;
    pos.longitude = data.longitude;
    pos.altitude = data.altitude;

    if (app.locals.player) {
      app.locals.player.updateLocation(pos);
    }

    var authInfo = data.auth_info;
    if (authInfo) {
      app.locals.authInfo = authInfo;
    }
    // console.log(pos);
    // console.log(authInfo);
  });

  mitmServer.addRequestHandler('*', (data, action) => {
    console.log('REQUEST ' + action);
  });
  mitmServer.addResponseHandler('*', (data, action) => {
    console.log('RESPONSE ' + action)
  });

  mitmServer.addResponseHandler('GetPlayer', (data, action) => {
    var localPlayer = data.local_player;
    if (!localPlayer) {
      console.error('localPlayer was undefined')
      return data;
    }

    var player = new Player(localPlayer);
    console.log('PLAYER COMING THRU')
    app.locals.player = player;
  });

  mitmServer.addResponseHandler('GetMapObjects', (data, action) => {
    var now = (new Date()).getTime();
    app.locals.mapCells = data.map_cells;

    if (!app.locals.player) app.locals.player = new Player();

    data.map_cells.forEach((cell) => {
      if (!_.isEmpty(cell.catchable_pokemons)) {
        // console.log(cell.catchable_pokemons);
      }
      cell.forts.forEach((fort) => {
        if (fort.type != 'CHECKPOINT') return;
        if (fort.cooldown_complete_timestamp_ms <= now || !fort.cooldown_complete_timestamp_ms) {
          var fortLocation = {
            latitude: fort.latitude,
            longitude: fort.longitude,
          };
          var distance = haversine(app.locals.player.location, fortLocation);
          if (distance < 0.05) {
            console.log('This fort is flickable')
            console.log(fort);
          }
          // console.log('this fort can be flicked');
        }
      });
    })
  });
}

