const rand = require('randgen');
const mitmConfig = require('../../config').mitm;

module.exports = mitmServer => {
  // TODO Also add the NormalizedHitPosition as soon as content length is fixed

  mitmServer.addRequestHandler('CatchPokemon', (data) => {
    if (mitmConfig.betterThrow) {
      data.normalized_reticle_size = Math.min(1.95, rand.rnorm(1.9, 0.05));
      data.spin_modifier = Math.min(0.95, rand.rnorm(0.85, 0.1));
      if (data.hit_pokemon) {
        data.NormalizedHitPosition = 1.0;
      }
    }

    return data;
  });
};
