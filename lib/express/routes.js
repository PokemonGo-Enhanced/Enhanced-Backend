var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

const api = express.Router();
api.get('/player', (req, res) => {
  res.send(app.locals.player);
});

api.get('/pokemons', (req, res) => {
  res.send(app.locals.pokemons);
});

api.get('/items', (req, res) => {
  res.send(app.locals.items);
});

router.use('/api', api);

module.exports = router;
