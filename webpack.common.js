// webpack.common.js

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    clean: true, // clean dist folder before each build
    publicPath: "/todo-list/",
    filename: "bundle.js", // default, can be overridden in prod
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"], // load CSS
      },
      {
        test: /\.html$/i,
        loader: "html-loader", // load HTML files
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource", // images
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // base HTML template
    }),
  ],
};
