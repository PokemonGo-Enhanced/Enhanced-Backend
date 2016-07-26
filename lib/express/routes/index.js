const debug = require('debug')('enhanced:rest');
const express = require('express');
const rpc = require('./rpc');
const router = new express.Router();
const api = new express.Router();
const state = require('../../state');
const _ = require('lodash');

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
    pokemons = state.pokemons.filter(pokemon => pokemon.pokemon_id === req.params.id.toUpperCase());
  }

  res.json(pokemons);
});

// Nasty because I'm in a hurry, create a GET endpoint for all known state
_.keys(state).forEach(key => {
  debug('created endpoint for', key);
  api.get(`/${key}`, (req, res) => {
    res.json(state[key]);
  });
});

api.use('/rpc', rpc);
router.use('/api', api);

module.exports = router;
