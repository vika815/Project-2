const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable the Cross-Origin-Opener-Policy middleware that Metro adds by default
// This allows the Google OAuth popup window to communicate with the main application
// when returning from authentication.
const originalEnhanceMiddleware = config.server?.enhanceMiddleware;
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware, server) => {
    const customMiddleware = (req, res, next) => {
      const originalSetHeader = res.setHeader;
      res.setHeader = function (name, value) {
        if (name.toLowerCase() === 'cross-origin-opener-policy' || name.toLowerCase() === 'cross-origin-embedder-policy') {
          // Setting both to unsafe-none to ensure the popup can communicate with the main application
          return originalSetHeader.call(this, name, 'unsafe-none');
        }
        return originalSetHeader.call(this, name, value);
      };
      return middleware(req, res, next);
    };

    if (originalEnhanceMiddleware) {
      return originalEnhanceMiddleware(customMiddleware, server);
    }
    return customMiddleware;
  },
};

module.exports = config;
