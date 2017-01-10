var path = require("path");

module.exports = {
  context: __dirname,
  entry: "./frontend/entry.jsx",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: [/\.jsx?$/, /\.js?$/],
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  devtool: 'source-maps',
  resolve: {
    root: __dirname,
    alias: {
      "ConsoleWrapper": "frontend/components/console_wrapper.jsx",
      "ConsoleComponent": "frontend/components/console_component.jsx",
      "Entry": "frontend/entry.jsx",
      "App": "frontend/components/app.jsx",
      "Root": "frontend/components/root.jsx"
    },
    extensions: ["", ".js", ".jsx" ]
  }
};
