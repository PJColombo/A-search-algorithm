const path = require('path');

module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.JS$/,
        exclude: /node_modules/,
        loader: ['babel-loader'],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: ['style-loader', 'css-loader'] //El orden importa, se empezaria a compilar por el final
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,  
        use: [{
            loader: 'url-loader',
            options: { 
                limit: 8000, // Convert images < 8kb to base64 strings
                name: 'images/[hash]-[name].[ext]'
            } 
        }]
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist')
  },
  resolve: {
    extensions: [".js", ".es6"]
  }
};