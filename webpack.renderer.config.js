/*
 * @Author: your name
 * @Date: 2022-02-08 14:28:58
 * @LastEditTime: 2022-02-08 17:44:55
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\webpack.renderer.config.js
 */
const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins");

rules.push({
  test: /\.css$/,
  use: [{ loader: "style-loader" }, { loader: "css-loader" }],
});

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
    alias: {
      path: false,
      fs: false,
    },
  },
};
