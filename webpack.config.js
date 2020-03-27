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
				template: dir,
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
		filename: `js/${ isProduction ? 'main.min.js' : 'main.js' }`,
	},

	devServer: {
		contentBase: isProduction ? 'dist' : 'src',
		watchContentBase: ! isProduction,
		hot: ! isProduction,
		open: true,
		port: isProduction ? 1112 : 1111,
		host: 'localhost',
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					presets: [ '@babel/preset-env' ],
				},
			},
		],
	},

	plugins: [ ...generateHTML() ],
};
