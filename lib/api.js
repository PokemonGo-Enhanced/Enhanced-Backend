const debug = require('debug')('mitm:api');
const proto = require('pokemongo-protobuf');
const request = require('request');
const is = require('is');

let requestId = Math.round(Math.random() * 10000000);
function getId() {
  return requestId++;
}

// Just replace api with a lib at some point please

class API {
  constructor(app) {
    this.app = app;
  }

  createBareEnvelope() {
    const { locals } = this.app;

    return {
      status_code: 2,
      request_id: getId(),
      unknown6: {
        unknown1: 6,
        unknown2: { unknown1: 1 },
      },
      latitude: locals.player.location.latitude,
      longitude: locals.player.location.longitude,
      altitude: locals.player.location.altitude,
      auth_info: locals.authInfo,
      auth_ticket: locals.authTicket,
      unknown12: -1,
    };
  }

  craftRequest(action, data) {
    return this.app.locals.mitm.craftRequest(action, data, this.createBareEnvelope());
  }

  searchPokestop(fort) {
    const { locals } = this.app;
    const payload = {
      fort_id: fort.id,
      player_latitude: locals.player.location.latitude,
      player_longitude: locals.player.location.longitude,
      fort_latitude: fort.latitude,
      fort_longitude: fort.longitude,
    };

    return this.craftRequest('FortSearch', payload);
  }

  releasePokemon(pokemonOrId) {
    const id = is.object(pokemonOrId) ? pokemonOrId.id : pokemonOrId;
    console.log('Releasing pokemon', pokemonOrId)
    const payload = {
      pokemon_id: id,
    };

    return this.craftRequest('ReleasePokemon', payload);
  }

  evolvePokemon(pokemonOrId) {
    const id = is.object(pokemonOrId) ? pokemonOrId.id : pokemonOrId;
    const payload = {
      pokemon_id: id,
    };

    return this.craftRequest('EvolvePokemon', payload);
  }

  upgradePokemon(pokemonOrId) {
    const id = is.object(pokemonOrId) ? pokemonOrId.id : pokemonOrId;
    const payload = {
      pokemon_id: id,
    };

    return this.craftRequest('UpgradePokemon', payload);
  }

  releaseIf(pokemonOrId, conditions) {
    if (!conditions) conditions = this.app.locals.appConfig.autoReleaseSettings;
    const id = is.object(pokemonOrId) ? pokemonOrId.id : pokemonOrId;
    let shouldntRelease = false;

    // is evolved
    // is singular
    // strongest of its kind cp
    // strongest of its kind iv
    // stronger than (cp)
    // stronger than (iv)
    if (!shouldntRelease) {
      debug('Releasing pokemon.pokemon_id');
      return this.releasePokemon(pokemonOrId);
    } else {
      debug('NOT releasing pokemon.pokemon_id');
    }
  }
}

module.exports = API;
