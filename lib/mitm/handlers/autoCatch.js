const debug = require('debug')('mitm:autoFlick');
const Promise = require('bluebird');
const haversine = require('haversine');
const _ = require('lodash');
const safeProcess = require('../../utils/safeProcess');
const state = require('../../state');
const api = require('../../api');
const rand = require('randgen');

module.exports = (mitmServer, app) => {
  let playEncounter = lureInfo => {
    let fortId = lureInfo.fort_id
    debug('Lure has an activate', lureInfo.active_pokemon_id);

    let diskEncounterMsg = {
      encounter_id: lureInfo.encounter_id,
      fort_id: lureInfo.fort_id,
      player_latitude: state.location.latitude,
      player_longitude: state.location.longitude,
    };

    api.craftRequest('DiskEncounter', diskEncounterMsg)
      .then(data => {
        if (data.result != 'SUCCESS') {
          throw new Error(data);
        }
        let caught = false;
        let attemptCatch = => {
          let catchMessage = {
            encounter_id: lureInfo.encounter_id,
            pokeball: 1,
            normalized_reticle_size:Math.min(1.95, rand.rnorm(1.9, 0.05)),
          }
        }
      })
  }

  mitmServer.addResponseHandler('GetMapObjects', (data) => safeProcess(() => {
    let catchablePokemon = _.flatten(data.map_cells.map(cell => cell.catchable_pokemons || []));
    let catchableLureInfos = _.flatten(data.map_cells.map(cell => cell.forts))
      .filter(fort => haversine(state.locals.location, fort) <= 100)
      .map(fort => fort.lure_info)
      .filter(_.identity);



    // Should not re-attempt an auto-catch when one is ongoing
  }));
};
