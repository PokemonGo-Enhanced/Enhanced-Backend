const express = require('express');
const _ = require('lodash');
const router = new express.Router();

router.post('/release', (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).end();
  }

  const { locals } = req.app;

  return locals
    .api
    .releasePokemon(req.body.id)
    .asCallback(err => {
      if (err) {
        return res.status(500).send(err.msg || err.message);
      }

      // no content!
      _.remove(locals.pokemons, (pokemon) => pokemon.id === req.body.id);
      return res.status(204).end();
    });
});

module.exports = router;
