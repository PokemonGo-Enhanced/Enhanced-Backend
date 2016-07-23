const Promise = require('bluebird');
const express = require('express');
const _ = require('lodash');
const router = new express.Router();

function releasePokemons(ids, locals) {
  return Promise.map(ids, id => locals.api.releasePokemon(id), { concurrency: 3 })
    .each((data, i) => {
      _.remove(locals.pokemons, (pokemon) => pokemon.id === ids[i]);
    });
}


router.post('/release', (req, res, next) => {
  const { id } = req.body;
  if (!id) {
    const err = new Error('Missing argument: id');
    err.status = 400;
    return next(err);
  }

  const { locals } = req.app;
  return releasePokemons([req.body.id], locals)
    .then(data => res.send(data))
    .catch(next);
});

router.post('/release/batch', (req, res, next) => {
  const { ids } = req.body;
  if (!ids) {
    const err = new Error('Missing argument: ids');
    err.status = 400;
    return next(err);
  }

  const { locals } = req.app;
  return releasePokemons(ids, locals)
    .then(data => res.send(data))
    .catch(next);
});

router.post('/evolve/:id?', (req, res, next) => {
  if (!(req.body.id || req.params.id)) {
    const err = new Error('Missing argument: id(s)');
    err.status = 400;
    return next(err);
  }
  let id = req.body.id || req.params.id;
  const { locals } = req.app;

  locals.app.api.evolvePokemon(id).then(response => {
    if (response.result != 'SUCCESS') {
      let err = new Error(response);
      // Really not important right now, but wanted to try anyway
      // Please leave this be for now
      if (response.result == 'FAILED_POKEMON_MISSING')
        err.status = 404; // Not found, prefer this over 410 for now
      else if (response.result == 'FAILED_INSUFFICIENT_RESOURCES')
        err.status = 401; // Payment required
      else if (response.result == 'FAILED_POKEMON_CANNOT_EVOLVE')
        err.status = 400; // Bad request
      else if (response.result == 'FAILED_POKEMON_IS_DEPLOYED')
        err.status = 409; // Conflict
      throw err;
    }

    let newPokemon = response.evolved_pokemon_data;
    _.remove(locals.pokemons, pokemon => pokemon.id === id);
    locals.pokemons.push(newPokemon);

    return res.send(newPokemon);
  }).catch(next);
});

router.post('/upgrade/:id?', (req, res, next) => {
  if (!(req.body.id || req.params.id)) {
    const err = new Error('Missing argument: id');
    err.status = 400;
    return next(err);
  }
  let id = req.body.id || req.params.id;
  const { locals } = req.app;

  locals.app.api.upgradePokemon(id).then(response => {
    if (response.result != 'SUCCESS') {
      let err = new Error(response);
      // Really not important right now, but wanted to try anyway
      // Please leave this be for now
      if (response.result == 'ERROR_POKEMON_NOT_FOUND')
        err.status = 404; // Not found, prefer this over 410 for now
      else if (response.result == 'ERROR_INSUFFICIENT_RESOURCES')
        err.status = 401; // Payment required
      else if (response.result == 'ERROR_UPGRADE_NOT_AVAILABLE')
        err.status = 400; // Bad request
      else if (response.result == 'ERROR_POKEMON_IS_DEPLOYED')
        err.status = 409; // Conflict
      throw err;
    }

    let newPokemon = response.upgraded_pokemon;
    _.remove(locals.pokemons, pokemon => pokemon.id === id);
    locals.pokemons.push(newPokemon);

    return res.send(newPokemon);
  }).catch(next);
});


module.exports = router;
