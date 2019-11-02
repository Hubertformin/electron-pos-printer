const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: "node",
  mode: "production",
  entry: {
    app: [
        path.resolve(__dirname, 'src/libs/jquery.min.js'),
        path.resolve(__dirname, 'src/libs/jsbarcode.min.js'),
        path.resolve(__dirname, 'src/libs/qrcode.min.js'),
        path.resolve(__dirname, 'src/libs/body-init.js')
    ]
  },
  output: {
    path: path.resolve(__dirname, "./dist/libs"),
    filename: "58mm.bundle.js"
  },
  externals: [nodeExternals()],
};