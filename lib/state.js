const debug = require('debug')('enhanced:state');
const Player = require('./player');
const config = require('./config');
const fs = require('fs');

class State {
  constructor() {
    const state = this;
    state.mapCells = []; // not const
    state.authInfo = null;
    state.nearbyPokemons = [];
    state.apiEndpoint = null;
    state.player = new Player();
    state.pokemons = [];
    state.items = {};
    state.config = config.app;
    state.location = {};
    state.candy = {};
  }

  serialize() {
    return fs.writeFileSync('.app_state', JSON.stringify(this));
  }
}

const env = process.env.NODE_ENV;
let state;
if (env === 'development') {
  // TODO put this in class method
  try {
    state = JSON.parse(fs.readFileSync('.app_state'));
    if (state.player) {
      state.player = new Player(state.player);
    }
    debug('restored locals');
  } catch (e) {
    debug('failed to deserialize locals', e.message);
  }
} else {
  state = new State();
}

module.exports = state;
