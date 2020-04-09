const autoprefixer = require('autoprefixer');
const defaultConfig = require('@open-wc/building-webpack/modern-config');
const merge = require('webpack-merge');
const path = require('path');

const config = merge(
  defaultConfig({
    input: path.resolve(__dirname, 'src/index.html'),
    plugins: {
      workbox: false
    }
  }),
  {
    devServer: {
      hot: false
    },
    node: {
      fs: 'empty'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'pages-[name].min.js'
    },
    module: {
      rules: [
        {
          test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 100000,
                mimetype: 'application/x-font-woff',
                name: './fonts/[hash].[ext]'
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: 'css-loader'
        },
        {
          test: /\.s(a|c)ss$/,
          use: 'sass-loader',
          use: [
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [
                  autoprefixer()
                ]
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'svg-inline-loader',
              options: {
                removeSVGTagAttrs: false
              }
            },
          ],
        },
        {
          test: /\.(gif|png|jpe?g)$/i,
          use: 'url-loader',
        }
      ]
    }
  }
);

module.exports = config;