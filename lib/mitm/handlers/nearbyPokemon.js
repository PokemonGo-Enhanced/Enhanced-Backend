const debug = require('debug')('mitm:nearbyPokemon');
const haversine = require('haversine');
const _ = require('lodash');
const state = require('../../state');

function pushToContainer(cell, prop, container) {
  (cell[prop] || []).forEach(pokemon => container.push(pokemon));
}

module.exports = (mitmServer) => {
  mitmServer.addResponseHandler('GetMapObjects', (data) => {
    const mapCells = state.mapCells = data.map_cells;

    const wildPokemon = state.wildPokemon = [];
    const catchablePokemon = state.catchablePokemon = [];
    const nearbyPokemon = state.nearbyPokemon = [];

    mapCells.forEach(cell => {
      pushToContainer(cell, 'wild_pokemons', wildPokemon);
      pushToContainer(cell, 'catchable_pokemons', catchablePokemon);
      pushToContainer(cell, 'nearby_pokemons', nearbyPokemon);
    });

    // This fixes PokeGo's distance bug
    wildPokemon.forEach(pokemon => {
      const nearby = _.find(nearbyPokemon, { encounter_id: pokemon.encounter_id });
      if (!nearby) return;
      if (!state.location) return;

      debug('fixing distance for', pokemon);
      nearby.distance_in_meters = haversine(state.location, pokemon) * 1000;
    });
  });
};
