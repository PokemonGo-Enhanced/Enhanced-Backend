const config = require('./lib/config');
const app = new require('./lib/server');

app.listen(config.express.port);
