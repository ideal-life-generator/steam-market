var webpack = require("webpack");
var path = require("path");

module.exports = [
  {
    context: path.join(__dirname, "app"),
    entry: "./index.jsx",
    output: {
      path: path.join(__dirname, "app/build"),
      publicPath: "build/",
      filename: "bundle.js"
    },
    module: {
      loaders: [
        {
          test: /\.html$/,
          loader: "file-loader"
        },
        {
            test: /\.css$/,
          loader: "style-loader!css-loader"
        },
        {
          test: /\.less$/,
          loader: "style-loader!css-loader!less-loader"
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader",
          query: {
            presets: [ "es2015", "stage-2" ]
          }
        },
        {
          test: /\.jsx$/,
          exclude: /node_modules/,
          loader: "babel-loader",
          query: {
            presets: [ "es2015", "react", "stage-2" ]
          }
        },
        {
          test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
          loader: "file-loader"
        },
        {
          test: /\.json$/,
          loader: "json"
        }
      ]
    },
    resolve: {
      root: path.resolve("./app"),
      extensions: [ "", ".js", ".less" ]
    }
  }
];