const path = require('path');

module.exports = {
  entry: './application.ts',
  mode: 'production',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'target'),
    filename: 'application.js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          'ts-loader',
        ]
      }
    ]
  },
  ignoreWarnings: [{
    module: /node_modules\/express\/lib\/view\.js/
  }]
}