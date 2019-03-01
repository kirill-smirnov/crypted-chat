// Combined 'require' statements
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const frontConfig = {
  target: "web",
  entry: {
    app: ["./frontend/index.js"]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle-front.js",
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          cacheDirectory: true,
          presets: ['@babel/env']
        }
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader", // creates style nodes from JS strings
          "css-loader", // translates CSS into CommonJS
          "sass-loader" // compiles Sass to CSS, using Node Sass by default
        ]
      }
      
    ]
  }
}
const backConfig = {
  target: "node",
   node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          cacheDirectory: true,
          presets: ['@babel/env']
        }
      }
    ]
  },
  entry: {
    app: ["./src/index.js"]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle-back.js"
  },
  externals: [nodeExternals()],
};
// Combined 'module.exports'
module.exports = [ frontConfig, backConfig ];