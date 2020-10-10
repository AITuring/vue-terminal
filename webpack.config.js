const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
  entry: path.resolve(__dirname + "/src/index.js"),
  output: {
    path: path.resolve(__dirname + "/dist"),
    filename: "v-terminal.js"
  },
  resolve: {
    // alias: {
    //   "@": path.resolve(__dirname, "src/assets")
    // }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(scss|sass)$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ["url-loader"]
      },
      {
        test: /\.js$/,
        exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
        loader: "babel-loader"
      }
    ]
  },
  plugins: [new VueLoaderPlugin()]
};
