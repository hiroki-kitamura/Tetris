const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');

module.exports = {
  mode: 'development', // 開発モード
  entry: src + '/index.tsx', // 最初に読み込まれるファイル

  output: {
    path: dist, // 出力先のroot
    filename: 'bundle.js' // 出力したjsのファイル名
  },

  watch: true,

  module: {
    rules: [
      {
        test: /(\.js|\.jsx)/, // バンドルする拡張子
        exclude: /node_modules/, // バンドルしないディレクトリ
        loader: 'babel-loader' // 使用するローダー
      },
      {
        enforce: "pre",
        test: /\.js/,
        exclude: /node_modules/,
        loader: "eslint-loader",
      },
      {
        test: /\.tsx?/,
        use: "ts-loader",
      },
      {
        test: /\.wav/,
        use: "file-loader"
      }

    ],
  },

  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ],
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // importする時、拡張子を無視できるリスト
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: src + '/index.html',
      filename: 'index.html'
    })
  ]
};
