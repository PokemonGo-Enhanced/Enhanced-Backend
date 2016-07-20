const proto = require('pokemongo-protobuf');
const mitm = require('pokemon-go-mitm');
const haversine = require('haversine');
const rand = require('randgen');
const util = require('util');

const config = require('../config');
const Player = require('../player');
const api = require('./api');

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

  mitmServer.addResponseHandler('GetPlayer', (data, action) => {
    data = _.cloneDeep(data);
    var localPlayer = data.local_player;
    if (!localPlayer) {
      console.error('localPlayer was undefined')
      return data;
    }

    app.locals.player.updateWithProto(localPlayer);
    console.log('PLAYER COMING THRU')
    app.locals.player = player;
  });

  mitmServer.addRequestHandler('GetInventory', (data) => {
    var since = new Date(_.toNumber(data.last_timestamp_ms))
    console.log('Requesting inventory since', new Date(since))
  })

  mitmServer.addRequestHandler('CatchPokemon', (data) => {
    console.log(data)
    data.normalized_reticle_size = Math.min(1.95, rand.rnorm(1.9, .05));
    data.spin_modifier = Math.min(.95, rand.rnorm(.85, .1));
    if (data.hit_pokemon && data.NormalizedHitPosition) {
      data.NormalizedHitPosition = 1.;
    }
    console.log(data);

    return data;
  })

  mitmServer.addResponseHandler('GetInventory', (data, action) => {
    var originalDateMs = data.inventory_delta.original_timestamp_ms;
    var newDate = data.inventory_delta.new_timestamp_ms;
    console.log('Received inventory data');
    // console.log('Original', new Date(data.inventory_delta.original_timestamp_ms))
    console.log('original', data.inventory_delta.original_timestamp_ms);
    console.log('new', data.inventory_delta.new_timestamp_ms);
    // console.log('New', new Date(data.inventory_delta.new_timestamp_ms))
    var addedInventoryData = data.inventory_delta.inventory_items
      .filter(inv => !inv.deleted_item_key)
      .map(inv => inv.inventory_item_data);
    var deletedInventoryData = data.inventory_delta.inventory_items
      .filter(inv => inv.deleted_item_key)
      .map(inv => inv.inventory_item_data);

    if (deletedInventoryData.length) {
      console.log("DELETED")
      console.log(deletedInventoryData);
    }

    var addedPokemons = addedInventoryData.map(inv => inv.pokemon_data).filter(_.identity);
    var deletedPokemons = deletedInventoryData.map(inv => inv.pokemon_data).filter(_.identity);
    var items = addedInventoryData.map(inv => inv.item).filter(_.identity);
    console.log('Delta is', data.inventory_delta.inventory_items.length, 'large');
    console.log('Got', addedPokemons.length, ' +pokemons in the delta')
    console.log('Got', deletedPokemons.length, ' -pokemons in the delta')
    console.log('Got', items.length, 'items in the delta')

    if (items.length) {
      _.merge(app.locals.items, items);
    }

    if (!originalDateMs) {
      // On startup, just add all pokemons
      app.locals.pokemons = addedPokemons;
    } else {
      app.locals.pokemons = app.locals.pokemons.concat(addedPokemons);
      deletedPokemons.forEach(p => _.remove(app.locals.pokemons, p));
    }

    // console.log(util.inspect(_.head(data.inventory_delta.inventory_items)));
    var playerStats = _.head(addedInventoryData.map(inv => inv.player_stats).filter(_.identity));
    var playerCurrency = _.head(addedInventoryData.map(inv => inv.player_currency).filter(_.identity));

    console.log(playerStats);
    if (playerStats) app.locals.player.stats = playerStats;
    if (playerCurrency) app.locals.player.pokecoins = playerCurrency.gems;
    // console.log(playerStats);
  })

  mitmServer.addResponseHandler('GetMapObjects', (data, action) => {
    data = _.cloneDeep(data);
    try {
      var now = (new Date()).getTime();
      app.locals.mapCells = data.map_cells;

      data.map_cells.forEach((cell) => {
        if (!_.isEmpty(cell.catchable_pokemons)) {
          console.log(cell.catchable_pokemons);
        }
      });

      // Find all nearby pokestops that can be activated
      // forts = [].concat(data.map_cells.map(cell => cell.forts));
      // console.log('total of', forts.length, 'forts')
      // flickableForts = forts.filter((fort) => {
      //   if (fort.type != 'CHECKPOINT') return;
      //   if (fort.cooldown_complete_timestamp_ms <= now || !fort.cooldown_complete_timestamp_ms) {
      //     var fortLocation = {
      //       latitude: fort.latitude,
      //       longitude: fort.longitude,
      //     };
      //     var distance = haversine(app.locals.player.location, fortLocation);
      //     if (distance < 0.05) {
      //       console.log('This fort is flickable')
      //       // console.log(fort);
      //       return fort;
      //     }
      //   }
      //   return null;
      // });
      //
      flickableForts = [];

      console.log('found', flickableForts.length, 'flickable forts');
      var requests = flickableForts.map((fort) => {
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

