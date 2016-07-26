const debug = require('debug')('mitm:autoFlick');
const Promise = require('bluebird');
const haversine = require('haversine');
const _ = require('lodash');
const safeProcess = require('../../utils/safeProcess');
const state = require('../../state');

module.exports = (mitmServer, app) => {
  mitmServer.addResponseHandler('GetMapObjects', (data) => safeProcess(() => {
    let catchablePokemon = _.flatten(data.map_cells.map(cell => cell.catchable_pokemons || []));
    let catchableLureInfos = _.flatten(data.map_cells.map(cell => cell.forts))
      .filter(fort => haversine(state.locals.location, fort) <= 100)
      .map(fort => fort.lure_info)
      .filter(_.identity);

    // Should not re-attempt an auto-catch when one is ongoing
  }));
};
