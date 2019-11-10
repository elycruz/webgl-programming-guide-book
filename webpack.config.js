let {NODE_ENV} = process.env;

NODE_ENV = NODE_ENV || 'development';

const path = require('path'),

  webpack = require('webpack'),

  MiniCssExtractPlugin = require('mini-css-extract-plugin'),

  /*
   * SplitChunksPlugin is enabled by default and replaced
   * deprecated CommonsChunkPlugin. It automatically identifies modules which
   * should be splitted of chunk by heuristics using module duplication count and
   * module category (i. e. node_modules). And splits the chunks…
   *
   * It is safe to remove "splitChunks" from the generated configuration
   * and was added as an educational example.
   *
   * https://webpack.js.org/plugins/split-chunks-plugin/
   *
   */
  HtmlWebpackPlugin = require('html-webpack-plugin'),

  /*
   * We've enabled HtmlWebpackPlugin for you! This generates a html
   * page for you when you compile webpack, which will make you start
   * developing and prototyping faster.
   *
   * https://github.com/jantimon/html-webpack-plugin
   */

  isDev = NODE_ENV === 'development',
  {PORT = 8080, PUBLIC_URL} = process.env,
  srcAbsolutePath = path.resolve(__dirname, 'src'),
  distAbsolutePath = path.resolve(__dirname, 'dist'),
  devUrl = `http://localhost:${PORT}/`
;

module.exports = {
  mode: NODE_ENV,

  entry: './src/index.tsx',

  devtool: isDev ? "source-map" : false,

  output: {
    publicPath: isDev ? devUrl : '/',
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist')
  },

  plugins: [
    new webpack.DefinePlugin({
      PUBLIC_URL: isDev ? devUrl : PUBLIC_URL
    }),
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      template: '!!html-loader!public/index.html',
      templateParameters: {
        PUBLIC_URL
      }
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: isDev ? '[name].css' : '[name].[hash].css',
      chunkFilename: isDev ? '[id].css' : '[id].[hash].css',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          (isDev ?
              // Creates `style` nodes from JS strings
              'style-loader' :

              // In 'prod' extract css to files
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  hmr: isDev,
                },
              }
          ),

          // Translates CSS into CommonJS
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          // Compiles Sass to CSS
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {sourceMap: true, sourceComments: false}
            }
          }
          // compiles Sass to CSS, using Node Sass by default
        ],
        include: [
          srcAbsolutePath
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          minify: true
        }
      },
      {
        test: /\.[tj]sx?$/,
        loader: 'babel-loader',
        include: [srcAbsolutePath],
        exclude: [/node_modules/]
      },
      {
        test: /\.glsl$/i,
        loader: 'raw-loader'
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/
        }
      },

      chunks: 'async',
      minChunks: 1,
      minSize: 30000,
      name: true
    }
  },

  devServer: {
    contentBase: [srcAbsolutePath, distAbsolutePath],
    open: true,
    port: PORT
  },

  resolve: {
    // options for resolving module requests
    // (does not apply to resolving to loaders)
    modules: [
      'node_modules',
      srcAbsolutePath
    ],

    extensions: ['.tsx', '.ts', '.jsx', '.js', '.scss', '.html']
  }
};
