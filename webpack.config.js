const path = require("path")
module.exports = {
  context: path.resolve(__dirname, "./"),
  resolve: {
    extensions: [".js", ".vue", ".json", ".scss"],
    alias: {
      "@": path.resolve(__dirname, "./")
    }
  }
}
// #ifdef H5
if (process.env.NODE_ENV !== "development") {
  window.uni = uni
}
// #endif
