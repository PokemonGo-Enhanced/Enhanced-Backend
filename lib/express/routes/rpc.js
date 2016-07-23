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

module.exports = router;
