const debug = require('debug')('mitm:autoRelease');
const safeProcess = require('../../utils/safeProcess');
const state = require('../../state');

module.exports = (mitmServer, app) => {
  const { api } = app.locals;
  mitmServer.addResponseHandler('CatchPokemon', (data) => safeProcess(() => {
    if (state.config.autoRelease && data.status === 'CATCH_SUCCESS') {
      const promise = api.releaseIf(data.captured_pokemon_id);
      if (promise) {
        // Say goodbye again
        debug('releasing %s', data.captured_pokemon_id);
        data.status = 'CATCH_FLEE';
      }
    }
  }));
};
