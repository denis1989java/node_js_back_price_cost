const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path');

module.exports = {

    entry: './src/frontend/price_cost.tsx',

    output: {
        path: path.join(__dirname),
        filename: 'build/price_cost.js'
    },

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader'
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/frontend/price_cost.html', filename: "build/price_cost.html"
        })
    ]
};