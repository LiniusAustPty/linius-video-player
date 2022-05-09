const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const base64 = require("postcss-base64");

module.exports = {
  entry: path.resolve(__dirname, "./src/index.ts"),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(s(a|c)ss)$/,
        use: [
          process.env.NODE_ENV === "development"
            ? "style-loader"
            : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(svg|ttf|eot|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        use: ["base64-inline-loader"],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.json$/,
        loader: "json-loader",
      },
    ],
  },
  resolve: {
    extensions: ["*", ".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    clean: true,
    filename: "lvp.js",
    library: {
      name: "lvp",
      export: "lvp",
      type: "umd",
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "lvp.css",
    }),
  ],
};
