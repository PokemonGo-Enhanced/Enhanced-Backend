var express = require('express');
var router = express.Router();
var rpc = require('./rpc');

/* GET home page. */

router.get('/', function(req, res) {
  res.send('OHAI');
});

const api = express.Router();
api.get('/player', (req, res) => {
  res.send(app.locals.player);
});

api.get('/pokemon', (req, res) => {
  res.send(app.locals.pokemons);
});

api.get('/items', (req, res) => {
  res.send(app.locals.items);
});

api.use('/rpc', rpc);
router.use('/api', api);

module.exports = router;

