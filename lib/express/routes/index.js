const express = require('express');
const rpc = require('./rpc');
const router = new express.Router();
const api = new express.Router();
const state = require('../../state');

/* GET home page. */

router.get('/', (req, res) => {
  res.send('OHAI');
});

api.get('/player', (req, res) => {
  res.json(state.player);
});

api.get('/pokemon/:id?', (req, res) => {
  let pokemons = state.pokemons;
  if (req.params.id) {
    pokemons = pokemons.filter(pokemon => pokemon.pokemon_id === req.params.id.toUpperCase());
  }

  res.json(pokemons);
});

api.get('/items', (req, res) => {
  res.json(state.items);
});

api.use('/rpc', rpc);
router.use('/api', api);

module.exports = router;
