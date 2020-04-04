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
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );

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
		host: 'localhost',
		headers: {
			'Cache-Control': isProduction
				? 'public, max-age=604800'
				: 'private, max-age=0, no-cache'
		},
		compress: isProduction
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
				test: /\.(pdf|gif|png|jpe?g)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: isProduction
								? '[name].[contenthash].[ext]'
								: '[name].[ext]',
							outputPath: 'static/'
						}
					},
					isProduction
						? {
								loader: 'image-webpack-loader',
								options: {
									bypassOnDebug: true,
									gifsicle: {
										interlaced: false
									},
									optipng: {
										optimizationLevel: 7
									},
									pngquant: {
										quality: '65-90',
										speed: 4
									},
									mozjpeg: {
										progressive: true
									}
								}
						  }
						: null
				].filter( Boolean )
			},
			{
				test: /\.svg$/,
				exclude: [ path.resolve( __dirname, 'src/fonts' ) ],
				use: [
					{
						loader: 'file-loader',
						options: {
							name: isProduction
								? '[name].[contenthash].[ext]'
								: '[name].[ext]',
							outputPath: 'static/'
						}
					},
					isProduction
						? {
								loader: 'image-webpack-loader',
								options: {
									bypassOnDebug: true,
									gifsicle: {
										interlaced: false
									},
									optipng: {
										optimizationLevel: 7
									},
									pngquant: {
										quality: '65-90',
										speed: 4
									},
									mozjpeg: {
										progressive: true
									}
								}
						  }
						: null
				].filter( Boolean )
			},
			{
				test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'file-loader',
				options: {
					name: isProduction
						? '[name].[contenthash].[ext]'
						: '[name].[ext]',
					outputPath: 'fonts/',
					publicPath: '../fonts/'
				}
			},
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				include: [ path.resolve( __dirname, 'src/fonts' ) ],
				loader: 'file-loader',
				options: {
					name: isProduction
						? '[name].[contenthash].[ext]'
						: '[name].[ext]',
					outputPath: 'fonts/',
					publicPath: '../fonts/'
				}
			}
		]
	},

	plugins: [
		new CleanWebpackPlugin(),
		new StylelintPlugin( {
			fix: true
		} ),
		new MiniCssExtractPlugin( {
			filename: 'css/[name].min.css',
			chunkFilename: 'css/[name].[contenthash].min.css'
		} ),
		new OptimizeCssAssetsPlugin( {
			assetNameRegExp: /\.css$/g,
			cssProcessor: cssnano,
			cssProcessorOptions: { discardComments: { removeAll: true } },
			canPrint: true
		} ),
		new CopyWebpackPlugin( [
			{
				from: './src/static/',
				to: './static/'
			}
		] ),
		...generateHTML()
	]
};
