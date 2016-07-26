const debug = require('debug')('mitm:player');
const _ = require('lodash');
const state = require('../../state');

module.exports = (mitmServer, app) => {
  mitmServer.addResponseHandler('GetPlayer', (_data) => {
    const data = _.cloneDeep(_data);
    const localPlayer = data.local_player || data.player_data;

    if (!localPlayer) {
      debug('local player undefined', _data);
      return data;
    }

    state.player.updateWithProto(localPlayer);
    debug('PLAYER COMING THRU');
    return null;
  });
};
