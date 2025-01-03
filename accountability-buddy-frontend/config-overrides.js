const {
  override,
  addBabelPreset,
  addBabelPlugin,
  addWebpackAlias,
} = require("customize-cra");
const path = require("path");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = override(
  // Add Babel presets for ES6+, React, and TypeScript (if used)
  addBabelPreset("@babel/preset-env"),
  addBabelPreset("@babel/preset-react"),
  addBabelPreset("@babel/preset-typescript"),

  // Add Babel plugins for modern JavaScript features
  addBabelPlugin("@babel/plugin-proposal-class-properties"), // Enable class properties
  addBabelPlugin(["@babel/plugin-proposal-decorators", { legacy: true }]), // Enable decorators
  addBabelPlugin("@babel/plugin-syntax-dynamic-import"), // Support dynamic imports

  // Add Webpack aliases for cleaner imports
  addWebpackAlias({
    "@components": path.resolve(__dirname, "src/components"),
    "@pages": path.resolve(__dirname, "src/pages"),
    "@services": path.resolve(__dirname, "src/services"),
    "@utils": path.resolve(__dirname, "src/utils"),
  }),

  // Custom Webpack configuration
  (config) => {
    // Enable Webpack Bundle Analyzer for bundle visualization
    if (process.env.ANALYZE_BUNDLE === "true") {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          reportFilename: "bundle-report.html",
          openAnalyzer: false,
        })
      );
    }

    // Enable source maps for easier debugging in development
    if (process.env.NODE_ENV === "development") {
      config.devtool = "source-map";
    }

    // Example: Customize module resolution or loaders here
    // config.module.rules.push({
    //   test: /\.custom$/,
    //   use: ["custom-loader"],
    // });

    return config;
  }
);
