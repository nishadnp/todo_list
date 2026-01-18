// webpack.prod.js

const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  devtool: false, // no source maps by default in prod
  output: {
    filename: "[name].[contenthash].js", // cache busting
    path: common.output?.path, // inherit dist path
  },
  optimization: {
    splitChunks: {
      chunks: "all", // splits vendor code automatically
    },
    runtimeChunk: "single", // better caching
  },
});
