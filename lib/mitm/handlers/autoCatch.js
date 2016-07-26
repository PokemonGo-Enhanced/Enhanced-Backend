const debug = require('debug')('mitm:autoFlick');
const haversine = require('haversine');
const _ = require('lodash');
const safeProcess = require('../../utils/safeProcess');
const state = require('../../state');

module.exports = (mitmServer, app) => {
  mitmServer.addResponseHandler('GetMapObjects', (data) => safeProcess(() => {
    const catchablePokemon = _.flatten(data.map_cells.map(cell => cell.catchable_pokemons || []));
    const catchableLureInfos = _.flatten(data.map_cells.map(cell => cell.forts))
      .filter(fort => haversine(state.locals.location, fort) <= 100)
      .map(fort => fort.lure_info)
      .filter(_.identity);

    // Should not re-attempt an auto-catch when one is ongoing
  }));
};
