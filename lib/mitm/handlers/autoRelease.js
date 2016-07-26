const debug = require('debug')('mitm:autoFlick');
const Promise = require('bluebird');
const haversine = require('haversine');
const mitmConfig = require('../../config').mitm;
const _ = require('lodash');
const safeProcess = require('../../utils/safeProcess');
const state = require('../../state');

module.exports = (mitmServer, app) => {
  const { api } = app.locals;
  mitmServer.addResponseHandler('CatchPokemon', (data) => safeProcess(() => {
    if (state.config.autoRelease && data.status == 'CATCH_SUCCESS') {
      let promise = api.releaseIf(data.captured_pokemon_id);
      if (promise) {
        // Say goodbye again
        data.status = 'CATCH_FLEE';
      }
    }
  }));
};
