const debug = require('debug')('mitm:inventory');
const _ = require('lodash');
const safeProcess = require('../../utils/safeProcess');
const state = require('../../state');

module.exports = (mitmServer, app) => {
  mitmServer.addResponseHandler('GetInventory', (data) => safeProcess(() => {
    const originalDateMs = data.inventory_delta.original_timestamp_ms;
    // console.log('original', data.inventory_delta.original_timestamp_ms);
    // console.log('new', data.inventory_delta.new_timestamp_ms);

    const addedInventoryData = data.inventory_delta.inventory_items
      .filter(inv => !inv.deleted_item_key)
      .map(inv => inv.inventory_item_data)
      .filter(_.identity); // Yup sometimes there are empty items

    const deletedInventoryData = data.inventory_delta.inventory_items
      .filter(inv => inv.deleted_item_key)
      .map(inv => inv.inventory_item_data)
      .filter(_.identity);

    if (deletedInventoryData.length) {
      debug('DELETED');
      debug(deletedInventoryData);
    }

    const addedPokemons = addedInventoryData.map(inv => inv.pokemon_data).filter(_.identity);
    const deletedPokemons = deletedInventoryData.map(inv => inv.pokemon_data).filter(_.identity);
    const items = addedInventoryData.map(inv => inv.item).filter(_.identity);

    debug('Delta is', data.inventory_delta.inventory_items.length, 'large');

    if (addedPokemons.length) debug('Got', addedPokemons.length, ' +pokemons in the delta');
    if (deletedPokemons.length) debug('Got', deletedPokemons.length, ' -pokemons in the delta');
    if (items.length) debug('Got', items.length, 'items in the delta');

    if (items.length) {
      const newItems = {};
      items.forEach(item => {
        newItems[item.item_id] = {
          count: item.count,
          unseen: item.unseen || false,
        };
      });

      _.merge(state.items, newItems);
    }

    deletedPokemons.forEach(pokemon => {
      debug('Removing pokemon ', pokemon.pokemon_id);
      _.remove(state.pokemons, other => other.id === pokemon.id);
    });

    if (!originalDateMs) {
      // On startup, just add all pokemons
      state.pokemons = addedPokemons;
    } else {
      state.pokemons = state.pokemons.concat(addedPokemons);
      deletedPokemons.forEach(p => _.remove(state.pokemons, p));
    }

    // console.log(util.inspect(_.head(data.inventory_delta.inventory_items)));
    const playerStats = _.head(addedInventoryData.map(inv => inv.player_stats).filter(_.identity));
    const playerCurrency = _.head(addedInventoryData.map(inv => inv.player_currency).filter(_.identity));
    const candies = addedInventoryData.map(inv => inv.candy).filter(_.identity);

    if (playerStats) state.player.stats = playerStats;
    if (playerCurrency) state.player.pokecoins = playerCurrency.gems;
    candies.forEach(candy => {
      let newCandy = {};
      newCandy[candy.family_id] = candy.candy;
      _.merge(state.player.candy, newCandy);
    });
  }));
};
