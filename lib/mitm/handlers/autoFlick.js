const debug = require('debug')('mitm:autoFlick');
const Promise = require('bluebird');
const haversine = require('haversine');
const mitmConfig = require('../../config').mitm;
const _ = require('lodash');
const safeProcess = require('../../utils/safeProcess');

module.exports = (mitmServer, app) => {
  mitmServer.addResponseHandler('GetMapObjects', (data) => safeProcess(() => {
    const { locals } = app;
    const { api } = locals;
    const now = Date.now();
    locals.mapCells = data.map_cells;

    // Find all nearby pokestops that can be activated
    const forts = _.flatten(data.map_cells.map(cell => cell.forts));

    const flickableForts = forts.filter((fort) => {
      if (fort.type !== 'CHECKPOINT') return null;

      if (fort.cooldown_complete_timestamp_ms <= now || !fort.cooldown_complete_timestamp_ms) {
        const fortLocation = _.pick(fort, ['latitude', 'longitude']);
        const distance = haversine(app.locals.player.location, fortLocation);

        if (distance < 0.04) {
          return fort;
        }
      }
      return null;
    });

    debug('found', flickableForts.length, 'flickable forts');

    if (mitmConfig.autoFlick) {
      const requests = flickableForts.map(fort => api.searchPokestop(fort));

      return Promise
        .all(requests)
        .then(responses => {
          responses.forEach(res => {
            if (res.result != 'SUCCESS') {
              debug('Flicking pokestop failed', res.result);
            } else {
              debug('Flicking pokestop succeeded');
            }
          });
        })
        .catch(e => {
          debug('Flicking pokestop failed', e);
        });
    }

    return null;
  }));
};
