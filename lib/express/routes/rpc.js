var express = require('express');
var router = express.Router();
var api = require('../../api');

router.post('/release', (req, res) => {
  if (!req.id) {
    return res.status(400).end();
  }

  api.releasePokemon(req.id)
     .on('error', e => res.status(500).send(e.msg))
     .on('response', response => {
       res.status(200).end();
       //TODO not entirely sure if this is necessary, the server might send
       // an inventory to the client anyway
       _.remove(app.locals.pokemons, (pokemon) => pokemon.id == req.id);
     });
});

module.exports = router;
