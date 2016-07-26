const debug = require('debug')('mitm:player');
const _ = require('lodash');
const state = require('../../state');
const api = require('../../api');

module.exports = (mitmServer, app) => {
  mitmServer.addResponseHandler('CatchPokemon', data => {
    // Update comes in Inventory
  });

  mitmServer.addRequestHandler('ReleasePokemon', data => {
    // TODO Assume this succeeds for now
    _.remove(state.pokemons, pokemon => pokemon.id === data.pokemon_id);
  });

  mitmServer.addRequestHandler('EvolvePokemon', data => {
    // TODO Assume this succeeds for now
    _.remove(state.pokemons, pokemon => pokemon.id === data.pokemon_id);
    state.pokemons.push(data.evolved_pokemon_data);
  });
};
