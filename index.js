const config = require('./lib/config');
const app = require('./lib/server');

app.listen(config.express.port);
