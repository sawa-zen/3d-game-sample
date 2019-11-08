const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const projectRootPath = path.resolve(__dirname, './');
const assetsPath = path.resolve(projectRootPath, './public');

module.exports = {
  output: {
    path: assetsPath,
  },
  resolve: {
    modules: ['node_modules'],
    extensions: [
      ".js",
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: [
          'raw-loader',
          'glslify-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template.html',
    }),
    new CopyPlugin([
      { from: './src/static', to: './' },
    ]),
  ],
  devtool: 'inline-source-map',
  devServer: {
    open: true,
    host: '0.0.0.0',
    inline: true,
  },
};
