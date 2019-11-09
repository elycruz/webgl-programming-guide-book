const path = require('path'),

	webpack = require('webpack'),

	MiniCssExtractPlugin = require('mini-css-extract-plugin');

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

const HtmlWebpackPlugin = require('html-webpack-plugin');

/*
 * We've enabled HtmlWebpackPlugin for you! This generates a html
 * page for you when you compile webpack, which will make you start
 * developing and prototyping faster.
 *
 * https://github.com/jantimon/html-webpack-plugin
 *
 */
let {NODE_ENV, PORT = 8080, PUBLIC_URL} = process.env;

NODE_ENV = NODE_ENV || 'development';

const isDev = NODE_ENV === 'development';

module.exports = {
	mode: NODE_ENV,
	entry: './src/index.tsx',

	output: {
		filename: '[name].[chunkhash].js',
		path: path.resolve(__dirname, 'dist')
	},

	plugins: [
		new webpack.DefinePlugin({
			PUBLIC_URL: isDev ? `http://localhost:${PORT}/` : PUBLIC_URL
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
						}),

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
					path.resolve(__dirname, 'src')
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
				include: [path.resolve(__dirname, 'src')],
				exclude: [/node_modules/]
			}
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
		open: true,
		port: PORT
	},

	resolve: {
		extensions: ['.tsx', '.ts', '.jsx', '.js', '.scss', '.html']
	}
};
