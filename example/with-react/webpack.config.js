const HTMLWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
	mode: "development",
	entry: "./src/index.js",
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: "babel-loader",
				},
			},
			{
				test: /\.html$/i,
				use: [
					{
						loader: "html-loader",
					},
				],
			},
			{
				test: /\.scss$/,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							modules: {
								localIdentName: "[path][name]__[local]--[hash:base64:5]",
							},
						},
					},
					"sass-loader",
				],
			},
		],
	},
	resolve: {
		extensions: [".js", ".jsx", ".scss", ".json"],
		alias: {
			react: path.resolve(__dirname, "node_modules/react"),
			"react-dom": path.resolve(__dirname, "node_modules/react-dom"),
		},
	},
	plugins: [
		new HTMLWebpackPlugin({
			template: "./src/index.html",
			filename: "./index.html",
		}),
	],
	devtool: "inline-source-map",
	devServer: {
		historyApiFallback: true,
	},
};
