const debug = require('debug')('mitm:state');
const _ = require('lodash');
const state = require('../../state');

module.exports = (mitmServer) => {
  mitmServer.addResponseHandler('CatchPokemon', data => {
    debug('catch pokemon update', data);
    // Update comes in Inventory
  });

  mitmServer.addRequestHandler('ReleasePokemon', data => {
    // TODO Assume this succeeds for now
    debug('release pokemon', data);
    _.remove(state.pokemons, pokemon => pokemon.id === data.pokemon_id);
  });

  mitmServer.addRequestHandler('EvolvePokemon', data => {
    debug('evolve pokemon', data);
    // TODO Assume this succeeds for now
    _.remove(state.pokemons, pokemon => pokemon.id === data.pokemon_id);
    state.pokemons.push(data.evolved_pokemon_data);
  });
};
