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

/*
 * Plugins
 */

const HTMLWebpackPlugin = require( 'html-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const StylelintPlugin = require( 'stylelint-webpack-plugin' );

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
		filename: `js/${ isProduction ? 'main.min.js' : 'main.js' }`
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

	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.js$/,
				loader: 'eslint-loader'
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
			}
		]
	},

	plugins: [
		...generateHTML(),
		new MiniCssExtractPlugin( {
			filename: 'css/[name].min.css'
		} ),
		new StylelintPlugin()
	]
};
