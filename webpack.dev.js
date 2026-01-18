// webpack.dev.js

const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map", // fast rebuilds + debugging
  devServer: {
    static: "./dist",
    open: true, // open in browser automatically
    hot: true,  // hot module replacement
    watchFiles: ["./src/**/*"], // reload when any src file changes
  },
  output: {
    filename: "bundle.js", // consistent name in dev
  },
});
