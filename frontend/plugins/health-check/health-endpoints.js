/**
 * Health check endpoints setup
 * This module sets up health check endpoints for the dev server
 */

module.exports = function setupHealthEndpoints(devServer, healthPluginInstance) {
  // Add health check endpoint if the plugin instance is available
  if (healthPluginInstance && devServer.app) {
    devServer.app.get('/health', (req, res) => {
      const status = healthPluginInstance.getHealthStatus();
      res.json(status);
    });
  }
};

