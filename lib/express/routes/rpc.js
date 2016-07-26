const Promise = require('bluebird');
const express = require('express');
const _ = require('lodash');
const router = new express.Router();
const state = require('../../state');

function releasePokemons(ids, locals) {
  return Promise.map(ids, id => locals.api.releasePokemon(id), { concurrency: 3 })
    .each((data, i) => {
      _.remove(state.pokemons, (pokemon) => pokemon.id === ids[i]);
    });
}


router.post('/release/:id?', (req, res, next) => {
  const id = req.body.id || req.params.id;
  if (!id) {
    const err = new Error('Missing argument: id');
    err.status = 400;
    return next(err);
  }

  const { locals } = req.app;

  return releasePokemons([id], locals)
    .then(data => res.json(data[0]))
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
    .then(data => res.json(data))
    .catch(next);
});

router.post('/evolve/:id?', (req, res, next) => {
  if (!(req.body.id || req.params.id)) {
    const err = new Error('Missing argument: id(s)');
    err.status = 400;
    return next(err);
  }

  const id = req.body.id || req.params.id;
  const { locals } = req.app;

  return locals.api.evolvePokemon(id).then(response => {
    if (response.result !== 'SUCCESS') {
      const err = new Error(response);

      switch (response.result) {
        case 'FAILED_POKEMON_MISSING':
          err.status = 404;
          break;
        case 'FAILED_INSUFFICIENT_RESOURCES':
          err.status = 402;
          break;
        case 'FAILED_POKEMON_CANNOT_EVOLVE':
          err.status = 400;
          break;
        case 'FAILED_POKEMON_IS_DEPLOYED':
          err.status = 409;
          break;
        default:
          err.status = 500;
          break;
      }

      throw err;
    }

    const newPokemon = response.evolved_pokemon_data;
    _.remove(state.pokemons, pokemon => pokemon.id === id);
    state.pokemons.push(newPokemon);

    return res.json(newPokemon);
  }).catch(next);
});

router.post('/upgrade/:id?', (req, res, next) => {
  if (!(req.body.id || req.params.id)) {
    const err = new Error('Missing argument: id');
    err.status = 400;
    return next(err);
  }

  const id = req.body.id || req.params.id;
  const { locals } = req.app;

  return locals.api.upgradePokemon(id).then(response => {
    if (response.result !== 'SUCCESS') {
      const err = new Error(response);
      switch (response.result) {
        case 'FAILED_POKEMON_MISSING':
          err.status = 404;
          break;
        case 'FAILED_INSUFFICIENT_RESOURCES':
          err.status = 402;
          break;
        case 'FAILED_POKEMON_CANNOT_EVOLVE':
          err.status = 400;
          break;
        case 'FAILED_POKEMON_IS_DEPLOYED':
          err.status = 409;
          break;
        default:
          err.status = 500;
          break;
      }

      throw err;
    }

    const newPokemon = response.upgraded_pokemon;
    _.remove(state.pokemons, pokemon => pokemon.id === id);
    state.pokemons.push(newPokemon);

    return res.json(newPokemon);
  })
  .catch(next);
});


module.exports = router;
