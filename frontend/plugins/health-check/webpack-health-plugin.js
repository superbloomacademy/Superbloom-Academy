/**
 * Webpack health check plugin
 * This plugin monitors webpack build health
 */

class WebpackHealthPlugin {
  constructor() {
    this.isHealthy = true;
  }

  apply(compiler) {
    compiler.hooks.done.tap('WebpackHealthPlugin', (stats) => {
      // Mark as healthy if build succeeds
      this.isHealthy = !stats.hasErrors();
    });

    compiler.hooks.failed.tap('WebpackHealthPlugin', () => {
      // Mark as unhealthy if build fails
      this.isHealthy = false;
    });
  }

  getHealthStatus() {
    return {
      healthy: this.isHealthy,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = WebpackHealthPlugin;

