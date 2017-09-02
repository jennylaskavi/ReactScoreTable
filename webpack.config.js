module.exports = {
  entry: './src/App.js',
  output:{
    path: __dirname,
    filename: 'app.js'
  },
  devServer: {
      proxy: {
        '/api': 'http://127.0.0.1:20000'
      }},

  module: {
    loaders: [{
      test:/\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets:['es2015', 'react']
      }
    }]
  }
};
