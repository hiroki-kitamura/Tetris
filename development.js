const path = require('path');

const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');

module.exports = {
  mode: 'developent', // 開発モード
  entry: src + '/index.js', // 最初に読み込まれるファイル

  output: {
    path: dist, // 出力先のroot
    filename: 'bundle.js' // 出力したjsのファイル名
  },

  module: {
    rules: [
      {
        test: /.js/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  plugins: []
};

