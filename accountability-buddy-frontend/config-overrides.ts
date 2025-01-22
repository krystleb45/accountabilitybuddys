const {
  override,
  addBabelPreset,
  addBabelPlugin,
  addWebpackAlias,
} = require('customize-cra');
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = override(
  // Add Babel presets for ES6+, React, and TypeScript
  addBabelPreset('@babel/preset-env'),
  addBabelPreset('@babel/preset-react'),
  addBabelPreset('@babel/preset-typescript'),

  // Add Babel plugins for modern JavaScript features
  addBabelPlugin('@babel/plugin-proposal-class-properties'), // Enable class properties
  addBabelPlugin(['@babel/plugin-proposal-decorators', { legacy: true }]), // Enable decorators (if used)
  addBabelPlugin('@babel/plugin-syntax-dynamic-import'), // Support dynamic imports

  // Add Webpack aliases for cleaner imports
  addWebpackAlias({
    '@components': path.resolve(__dirname, 'src/components'),
    '@pages': path.resolve(__dirname, 'src/pages'),
    '@services': path.resolve(__dirname, 'src/services'),
    '@utils': path.resolve(__dirname, 'src/utils'),
    '@hooks': path.resolve(__dirname, 'src/hooks'),
    '@assets': path.resolve(__dirname, 'src/assets'),
  }),

  // Custom Webpack configuration
  (config) => {
    // Enable Webpack Bundle Analyzer for bundle visualization
    if (process.env.ANALYZE === 'true') {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: 'bundle-report.html',
          openAnalyzer: false,
        })
      );
    }

    // Enable source maps for debugging (conditionally disable in production)
    if (process.env.NODE_ENV === 'development') {
      config.devtool = 'source-map';
    } else {
      config.devtool = false; // Disable source maps in production
    }

    // Add TypeScript type checking
    config.plugins.push(new ForkTsCheckerWebpackPlugin());

    return config;
  }
);
