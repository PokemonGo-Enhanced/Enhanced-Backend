const proto = require('pokemongo-protobuf');
const mitm = require('pokemon-go-mitm-node');
const config = require('./config');


class Server {
  constructor() {
    this.mitm = null;
  }

  start() {
    this.mitm = new mitm(config.port);
  }
}

module.exports = Server;
