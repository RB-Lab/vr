const path = require('path');

module.exports = {
	entry: './js/index.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		publicPath: '/',
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js/,
				loader: 'babel-loader',
				exclude: /(node_modules)/
			}
		]
	},
	devServer: {
		contentBase: path.resolve(__dirname, 'build'),
		historyApiFallback: true,
		noInfo: true,
		inline: true
		// hot: true, -- can't make it work ;-(
	}
};
