const debug = require('debug')('mitm:api');
const proto = require('pokemongo-protobuf');
const request = require('request');
const is = require('is');
const state = require('./state');
const poke = require('pokemongo-data');

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
    return {
      status_code: 2,
      request_id: getId(),
      unknown6: {
        unknown1: 6,
        unknown2: { unknown1: 1 },
      },
      latitude: state.location.latitude,
      longitude: state.location.longitude,
      altitude: state.location.altitude,
      auth_info: state.authInfo,
      auth_ticket: state.authTicket,
      unknown12: -1,
    };
  }

  craftRequest(action, data) {
    return this.app.locals.mitm.craftRequest(action, data, this.createBareEnvelope(),
                                             'https://pgorelease.nianticslabs.com' + state.apiEndpoint);
  }

  searchPokestop(fort) {
    const payload = {
      fort_id: fort.id,
      player_latitude: state.location.latitude,
      player_longitude: state.location.longitude,
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
    if (!conditions) conditions = state.config.autoReleaseSettings;
    const id = is.object(pokemonOrId) ? pokemonOrId.id : pokemonOrId;
    const pokemon = is.object(pokemonOrId) ? pokemonOrId : _.find(state.pokemons, p => p.id === id);
    let shouldntRelease = false;
    let pokemonData = poke.data.byName[id];
    let exceptions = state.config.autoReleaseExceptions;

    // is evolved
    shouldntRelease = shouldntRelease || exceptions.isEvolved && !pokemonData.EvolvesFrom;
    // is singular
    shouldntRelease = shouldntRelease || exceptions.isOneOff && !pokemonData.EvolvesFrom && !pokemonData.EvolvesTo;
    // strongest of its kind cp
    let strongestLikeIt = _.maxBy(_.filter(state.pokemons, p => p.id === pokemon.pokemon_id && p.id !== id),
                                  p => p.cp);
    shouldntRelease = shouldntRelease || exceptions.hasHighestCPOfKind &&
      (!strongestLikeIt || strongestLikeIt.cp <= pokemon.cp);
    // strongest of its kind iv
    let mostPerfectLikeIt = _.maxBy(_.filter(state.pokemons, p => p.id === pokemon.pokemon_id && p.id !== id),
                                  p => poke.stats.powerQuotient(p));
    shouldntRelease = shouldntRelease || exceptions.isMostPerfectOfKind &&
      (!mostPerfectLikeIt || poke.stats.powerQuotient(mostPerfectLikeIt) <= poke.stats.powerQuotient(pokemon));
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
