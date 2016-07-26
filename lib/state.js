const debug = require('debug')('enhanced:state');
const Player = require('./player');
const config = require('./config');
const fs = require('fs');
const _ = require('lodash');

class State {
  constructor(other) {
    const state = {};
    if (other) {
      _.merge(this, other);
    }
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

    _.defaults(this, state);
  }

  serialize() {
    return fs.writeFileSync('.app_state', JSON.stringify(this));
  }
}

const env = process.env.NODE_ENV || 'development';
let state;
if (env === 'development') {
  // TODO put this in class method
  try {
    debug('deserializing state');
    state = new State(JSON.parse(fs.readFileSync('.app_state')));
    if (state.player) {
      state.player = new Player(state.player);
    }
    debug('restored locals');
  } catch (e) {
    debug('failed to deserialize locals', e.message);
    state = new State();
  }
} else {
  state = new State();
}

module.exports = state;
