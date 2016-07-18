const proto = require('pokemongo-protobuf');
const mitm = require('pokemon-go-mitm-node');

const config = require('./config');
const Player = require('./player');


class Server {
  constructor() {
    this.mitm = null;
    this.player = new Player();
  }

  start() {
    this.mitm = new mitm(config.port);
  }
}

module.exports = Server;
