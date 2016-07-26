module.exports = {
  proxy: {
    port: process.env.PROXY_PORT || 8080,
  },
  express: {
    port: process.env.EXPRESS_PORT || 8000,
    host: process.env.EXPRESS_HOST || '0.0.0.0',
  },
  mitm: {
    autoFlick: true,
    betterThrow: true,
  },
  app: {
    autoFlick: false,
    betterThrow: true,
    autoRelease: false,
    autoReleaseExceptions: {
      pokemonsIds: [],
      isEvolved: true,
      isOneOff: true,
      hasHighestCPOfKind: true,
      isMostPerfectOfKind: true,
      hasMoreCPThan: 1000,
      isMorePerfectThan: 85,
    }
  },
};
