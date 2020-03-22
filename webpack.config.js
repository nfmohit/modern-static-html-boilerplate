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

module.exports = {
	entry: './src/js/main.js',
	output: {
		path: path.resolve( __dirname, 'dist' ),
		filename: 'main.min.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					presets: [ '@babel/preset-env' ]
				}
			}
		]
	}
}
