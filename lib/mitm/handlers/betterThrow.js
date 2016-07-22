const mitmConfig = require('../../config').mitm;

module.exports = mitmServer => {
  //TODO Also add the NormalizedHitPosition as soon as content length is fixed
  mitmServer.addRequestHandler('CatchPokemon', (data) => {
    console.log(data)
    if (mitmConfig.betterThrow) {
      data.normalized_reticle_size = Math.min(1.95, rand.rnorm(1.9, .05));
      data.spin_modifier = Math.min(.95, rand.rnorm(.85, .1));
      if (data.hit_pokemon && data.NormalizedHitPosition) {
        data.NormalizedHitPosition = 1.;
      }
      console.log(data);
    }

    return data;
  });
}
