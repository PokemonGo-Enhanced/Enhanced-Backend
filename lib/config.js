module.exports = {
  proxy: {
    port: process.env.PROXY_PORT || 8080,
  },
  express: {
    port: process.env.EXPRESS_PORT || 3000,
  },
  mitm: {
    autoFlick: true,
    betterThrow: true,
  },
};
