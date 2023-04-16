const devCerts = require('office-addin-dev-certs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
var dotenv = require('dotenv').config({ path: __dirname + '/.env' });

const urlDev = 'https://localhost:3000/';
const urlProd = 'https://www.contoso.com/'; // CHANGE THIS TO YOUR PRODUCTION DEPLOYMENT LOCATION

async function getHttpsOptions() {
  const httpsOptions = await devCerts.getHttpsServerOptions();
  return { ca: httpsOptions.ca, key: httpsOptions.key, cert: httpsOptions.cert };
}

module.exports = async (env, options) => {
  const dev = options.mode === 'development';
  const buildType = dev ? 'dev' : 'prod';
  const config = {
    devtool: 'source-map',
    entry: {
      polyfill: ['core-js/stable', 'regenerator-runtime/runtime'],
      vendor: ['react', 'react-dom', 'core-js', '@fluentui/react'],
      taskpane: ['react-hot-loader/patch', './src/taskpane/index.tsx'],
      commands: './src/commands/commands.ts',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.html', '.js'],
      fallback: {
        Promise: require.resolve('es6-promise'),
      },
    },
    module: {
      rules: [
        {
          test: /\.worker\.ts$/,
          loader: 'worker-loader',
        },
        {
          test: /\.tsx?$/,
          use: ['react-hot-loader/webpack', 'ts-loader'],
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          type: 'asset/resource',
          generator: {
            filename: '[path][name].[ext]',
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(dotenv.parsed),
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            to: 'taskpane.css',
            from: './src/taskpane/taskpane.css',
          },
          {
            to: '[name]' + '[ext]',
            from: 'manifest*.xml',
            transform(content) {
              if (dev) {
                return content;
              } else {
                return content.toString().replace(new RegExp(urlDev, 'g'), urlProd);
              }
            },
          },
          {
            to: 'assets',
            from: 'assets',
          },
        ],
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[hash].css',
      }),
      new HtmlWebpackPlugin({
        filename: 'taskpane.html',
        template: './src/taskpane/taskpane.html',
        chunks: ['taskpane', 'vendor', 'polyfills'],
      }),
      // Needed as Azure deployment expects an index.html file
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html',
        chunks: ['index'],
      }),
      new HtmlWebpackPlugin({
        filename: 'commands.html',
        template: './src/commands/commands.html',
        chunks: ['commands'],
      }),
    ],
  };

  if (env.WEBPACK_SERVE) {
    config.devServer = {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      server: {
        type: 'https',
        options: options.https !== undefined ? options.https : await getHttpsOptions(),
      },
      port: process.env.npm_package_config_dev_server_port || 3000,
    };
  }

  return config;
};
