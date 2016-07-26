const debug = require('debug')('mitm:nearbyPokemon');
const haversine = require('haversine');
const mitmConfig = require('../../config').mitm;
const _ = require('lodash');
const state = require('../../state');

module.exports = (mitmServer, app) => {
  mitmServer.addResponseHandler('GetMapObjects', (data) => {
    state.mapCells = data.map_cells;

    let wildPokemon = _.flatten(data.map_cells.map(cell => cell.wild_pokemons || []));
    let catchablePokemon = _.flatten(data.map_cells.map(cell => cell.catchable_pokemons || []));
    let nearbyPokemon = _.flatten(data.map_cells.map(cell => cell.nearby_pokemons || []));
    state.wildPokemon = wildPokemon;
    state.catchablePokemon = catchablePokemon;
    state.nearbyPokemon = nearbyPokemon;

    // This fixes PokeGo's distance bug
    wildPokemon.forEach(pokemon => {
      let nearby = _.find(nearbyPokemon, p => p.encounter_id == pokemon.encounter_id);
      if (!nearby) return;
      if (!state.location) return;
      nearby.distance_in_meters = haversine(state.location, pokemon) * 1000;
    });

    // debug('catchable', catchablePokemon);
    // debug('wild', wildPokemon)
    // debug('nearby', nearbyPokemon);
  });
};
