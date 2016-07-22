
module.exports = mitmServer => {
  mitmServer.addResponseHandler('GetInventory', (data, action) => {
    try {
      var originalDateMs = data.inventory_delta.original_timestamp_ms;
      var newDate = data.inventory_delta.new_timestamp_ms;
      console.log('original', data.inventory_delta.original_timestamp_ms);
      console.log('new', data.inventory_delta.new_timestamp_ms);

      var addedInventoryData = data.inventory_delta.inventory_items
        .filter(inv => !inv.deleted_item_key)
        .map(inv => inv.inventory_item_data)
        .filter(_.identity); // Yup sometimes there are empty items
      var deletedInventoryData = data.inventory_delta.inventory_items
        .filter(inv => inv.deleted_item_key)
        .map(inv => inv.inventory_item_data)
        .filter(_.identity);

      if (deletedInventoryData.length) {
        console.log("DELETED")
        console.log(deletedInventoryData);
      }

      data.inventory_delta.inventory_items.forEach(inv => console.log(inv));
      var addedPokemons = addedInventoryData.map(inv => inv.pokemon_data).filter(_.identity);
      var deletedPokemons = deletedInventoryData.map(inv => inv.pokemon_data).filter(_.identity);
      var items = addedInventoryData.map(inv => inv.item).filter(_.identity);
      console.log('Delta is', data.inventory_delta.inventory_items.length, 'large');
      console.log('Got', addedPokemons.length, ' +pokemons in the delta')
      console.log('Got', deletedPokemons.length, ' -pokemons in the delta')
      console.log('Got', items.length, 'items in the delta')

      if (items.length) {
        var newItems = {};
        items.forEach(item => {
          newItems[item.item_id] = {
            count: item.count,
            unseen: item.unseen || false,
          };
        });
        _.merge(app.locals.items, newItems);
      }

      deletedPokemons.forEach(pokemon => {
        console.log('Removing pokemon ', pokemon.pokemon_id);
        _.remove(app.locals.pokemons, other => other.id == pokemon.id);
      });

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
      var candy = addedInventoryData.map(inv => inv.pokemon_family).filter(_.identity)

      if (playerStats) app.locals.player.stats = playerStats;
      if (playerCurrency) app.locals.player.pokecoins = playerCurrency.gems;
      if (candy.length) app.locals.candy = candy;
    } catch (e) {
      console.error(e);
    }
  })
}
