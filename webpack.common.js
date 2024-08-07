/* eslint-disable */

const path = require('path')
console.log('WEBPACK ', __dirname)
module.exports = {
  entry: {
    popup: path.join(__dirname, 'src/popup/index.tsx'),
    settings: path.join(__dirname, 'src/settings/index.tsx'),
    addRule: path.join(__dirname, 'src/AddRule/index.tsx'),
    background: path.join(__dirname, 'src/background/background.ts'),
    content: path.join(__dirname, 'src/content/content.ts'),
  },
  output: {
    path: path.join(__dirname, 'dist/js'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        exclude: /node_modules/,
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader', // Creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // Translates CSS into CommonJS
          },
          {
            loader: 'sass-loader', // Compiles Sass to CSS
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      jquery: 'jquery/src/jquery',
    },
    extensions: ['.ts', '.tsx', '.js'],
  },
}
