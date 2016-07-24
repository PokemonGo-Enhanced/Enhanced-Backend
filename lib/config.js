module.exports = {
  proxy: {
    port: process.env.PROXY_PORT || 8080,
  },
  express: {
    port: process.env.EXPRESS_PORT || 3000,
    host: process.env.EXPRESS_HOST || '0.0.0.0',
  },
  mitm: {
    autoFlick: true,
    betterThrow: true,
  },
  app: {
    autoFlick: true,
    betterThrow: true,
    autoRelease: true,
    autoReleaseSettings: {
      
    }
  },
};
