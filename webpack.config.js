var path = require('path');
var webpack = require('webpack');

module.exports = {
   entry: './src/plotter.js',
   output: {
     path: __dirname,
     filename: 'bundle.js'
   },
   module: {
     loaders: [{
       test: /\.js$/,
       include: path.resolve('./src'),
       loader: 'babel?stage=0'
     }]
   }
};
