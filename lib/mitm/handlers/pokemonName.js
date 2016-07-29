const debug = require('debug')('mitm:pokemonName');
const _ = require('lodash');
const state = require('../../state');
const poke = require('pokemongo-data');

module.exports = (mitmServer) => {
  mitmServer.addResponseHandler('GetInventory', (data) => {
    debug(state.config.replacePokemonName);
    if (!state.config.replacePokemonName) return;

    if (data.inventory_delta) {
      data.inventory_delta.inventory_items.forEach(item => {
        let pokemon = item.inventory_item_data.pokemon_data;
        if (!pokemon) return;
        pokemon.nickname = `${poke.stats.atk(pokemon)}/${poke.stats.def(pokemon)}/${poke.stats.sta(pokemon)}`;
      })
    }

  });
};
