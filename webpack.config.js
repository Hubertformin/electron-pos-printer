const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require("terser-webpack-plugin");
const BundleDeclarationsWebpackPlugin = require("bundle-declarations-webpack-plugin");

let common_config = {
    target: "node",
    mode: "production",
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    externals: nodeExternals(),
    devtool: 'source-map'
}

module.exports = [
    Object.assign({}, common_config, {
        target: 'electron-main',
        entry: {
            "index": path.resolve(__dirname, 'src/main/index.ts')
        },
        output: {
            path: path.resolve(__dirname, "./dist"),
            library: "electronPosPrinter",
            filename: "[name].js",
            libraryTarget: "umd",
            umdNamedDefine: true,
        },
        plugins: [
            new BundleDeclarationsWebpackPlugin(),
        ],

    }),
    Object.assign({}, common_config, {
        target: 'electron-renderer',
        entry:  {
            "renderer": path.resolve(__dirname, 'src/renderer/renderer.ts')
        },
        output: {
            path: path.resolve(__dirname, "./dist/renderer"),
            filename: "[name].js"
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Print Preview',
                template: 'src/renderer/index.html'
            })
        ],
    })
];