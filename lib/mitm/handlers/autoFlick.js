const debug = require('debug')('mitm:autoFlick');
const Promise = require('bluebird');
const haversine = require('haversine');
const mitmConfig = require('../../config').mitm;
const api = require('../../api');
const _ = require('lodash');
const safeProcess = require('../../utils/safeProcess');

module.exports = (mitmServer, app) => {
  mitmServer.addResponseHandler('GetMapObjects', (data) => safeProcess(() => {
    const now = Date.now();
    app.locals.mapCells = data.map_cells;

    // Find all nearby pokestops that can be activated
    const forts = _.flatten(data.map_cells.map(cell => cell.forts));
    debug('total of', forts.length, 'forts');

    const flickableForts = forts.filter((fort) => {
      if (fort.type !== 'CHECKPOINT') return null;

      if (fort.cooldown_complete_timestamp_ms <= now || !fort.cooldown_complete_timestamp_ms) {
        const fortLocation = _.pick(fort, ['latitude', 'longitude']);
        const distance = haversine(app.locals.player.location, fortLocation);

        if (distance < 0.05) {
          return fort;
        }
      }
      return null;
    });

    debug('found', flickableForts.length, 'flickable forts');

    if (mitmConfig.autoFlick) {
      const requests = flickableForts.map(fort => api.searchPokestop(fort));

      return Promise
        .map(requests, () => {
          debug('Flicking pokestop succeeded');
        })
        .catch(e => {
          debug('Flicking pokestop failed', e);
        });
    }

    return null;
  }));
};
