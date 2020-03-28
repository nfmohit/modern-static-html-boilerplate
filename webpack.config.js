/**
 * Webpack configuration file.
 *
 * @author Nahid Ferdous Mohit.
 * @since  1.0.0
 */

/*
 * Dependencies
 */

const path = require( 'path' );
const glob = require( 'glob' );
const cssnano = require( 'cssnano' );

/*
 * Plugins
 */

const HTMLWebpackPlugin = require( 'html-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const StylelintPlugin = require( 'stylelint-webpack-plugin' );
const OptimizeCssAssetsPlugin = require( 'optimize-css-assets-webpack-plugin' );

/*
 * Variables
 */

const isProduction = process.env.NODE_ENV === 'production';

/*
 * Functions
 */

/* Generates HTML files */

const generateHTML = () =>
	glob.sync( './src/**/*.html' ).map(
		( dir ) =>
			new HTMLWebpackPlugin( {
				filename: path.basename( dir ),
				template: dir
			} )
	);

/*
 * Webpack Configuration
 */

module.exports = {
	mode: isProduction ? 'production' : 'development',
	devtool: isProduction ? false : 'eval-source-map',
	entry: './src/js/main.js',

	output: {
		path: path.resolve( __dirname, 'dist/' ),
		filename: `js/${
			isProduction ? '[name].[contenthash].min.js' : '[name].js'
		}`
	},

	devServer: {
		contentBase: isProduction ? 'dist' : 'src',
		watchContentBase: ! isProduction,
		hot: ! isProduction,
		liveReload: ! isProduction,
		open: true,
		port: isProduction ? 1112 : 1111,
		host: 'localhost'
	},

	optimization: isProduction
		? {
				runtimeChunk: 'single',
				splitChunks: {
					chunks: 'all',
					maxInitialRequests: Infinity,
					minSize: 0,
					cacheGroups: {
						vendor: {
							test: /[\\/]node_modules[\\/]/,
							name( module ) {
								const packageName = module.context.match(
									/[\\/]node_modules[\\/](.*?)([\\/]|$)/
								)[ 1 ];
								return `npm.${ packageName.replace(
									'@',
									''
								) }`;
							}
						}
					}
				}
		  }
		: {},

	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.js$/,
				loader: 'eslint-loader',
				options: {
					fix: true
				}
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				options: {
					presets: [ '@babel/preset-env' ]
				}
			},
			{
				test: /\.(sass|scss)$/,
				use: [
					isProduction
						? {
								loader: MiniCssExtractPlugin.loader
						  }
						: 'style-loader',
					'css-loader',
					'postcss-loader',
					'sass-loader'
				]
			},
			{
				enforce: 'pre',
				test: /\.html$/,
				exclude: /node_modules/,
				loader: 'prettier-loader'
			},
			{
				test: /\.html$/,
				exclude: /node_modules/,
				loader: 'html-loader'
			},
			{
				test: /\.(pdf|gif|png|jpe?g|svg)$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					outputPath: 'static/'
				}
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					outputPath: 'fonts/'
				}
			}
		]
	},

	plugins: [
		...generateHTML(),
		new MiniCssExtractPlugin( {
			filename: 'css/[name].min.css',
			chunkFilename: 'css/[id].min.css'
		} ),
		new StylelintPlugin( {
			fix: true
		} ),
		new OptimizeCssAssetsPlugin( {
			assetNameRegExp: /\.css$/g,
			cssProcessor: cssnano,
			cssProcessorOptions: { discardComments: { removeAll: true } },
			canPrint: true
		} )
	]
};
