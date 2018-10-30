let path = require('path');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');

let conf = {
  entry: './src/js/app.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'app.js',
  },
  devServer: {
    overlay: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.pug/,

        use: [
          'pug-loader'
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ],
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'app.css'
    }),
    new HtmlWebpackPlugin({
      template : './src/pug/index.pug'
    }),
    new CopyWebpackPlugin([
      { from: 'src/data/', to: 'data/', force: true },
      { from: 'src/img/', to: 'img/', force: true },
      { from: 'src/fonts/', to: 'fonts/', force: true }
    ], {})
  ],
};

module.exports = (env, options) => {
  let production = options.mode === 'production';
  conf.devtool = production ? false : 'eval-sourcemap';
  return conf;
};
