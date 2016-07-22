const express = require('express');
const rpc = require('./rpc');
const router = new express.Router();
const api = new express.Router();

/* GET home page. */

router.get('/', (req, res) => {
  res.send('OHAI');
});

api.get('/player', (req, res) => {
  res.json(req.app.locals.player);
});

api.get('/pokemon/:id?', (req, res) => {
  let pokemons = req.app.locals.pokemons;
  if (req.params.id) {
    pokemons = pokemons.filter(pokemon => pokemon.pokemon_id === req.params.id.toUpperCase());
  }

  res.send(pokemons);
});

api.get('/items', (req, res) => {
  res.json(req.app.locals.items);
});

api.use('/rpc', rpc);
router.use('/api', api);

module.exports = router;
