const proto = require('pokemongo-protobuf');
const mitm = require('pokemon-go-mitm');
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
  app.locals.apiEndpoint = null;

  mitmServer.addRequestEnvelopeHandler((data, ctx) => {
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
    var authTicket = data.auth_ticket;
    if (authTicket) {
      app.locals.authTicket = authTicket;
    }

    app.locals.apiEndpoint = ctx.url;
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
    try {
      var now = (new Date()).getTime();
      app.locals.mapCells = data.map_cells;

      if (!app.locals.player) app.locals.player = new Player();

      data.map_cells.forEach((cell) => {
        if (!_.isEmpty(cell.catchable_pokemons)) {
          // console.log(cell.catchable_pokemons);
        }
        cell.forts.forEach((fort) => {
        });
      });

      flickableForts = data.map_cells.map((cell) => {
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
            return fort;
          }
          // console.log('this fort can be flicked');
        }
      }).filter(x => x);

      console.log('found', flickableForts.length, 'flickable forts')
      var requests = flickableForts.forEach((fort) => {
        return api.searchPokestop(fort);
      });

      requests.forEach((req) => {
        req.on('error', e => {
          console.error('Flicking pokestop failed');
          console.error(e);
        }).on('response', res => {
          console.log('Flicking pokestop succeeded');
        });
      })

    } catch(e) {
      console.error(e.stack);
    }
  });
}

