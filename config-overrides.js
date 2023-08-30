module.exports = function override(config, env) {
  config.output.filename = "static/js/[name].js";
  config.output.publicPath = "auto";

  const miniCssExtractPlugin = config.plugins.find(
    (element) => element.constructor.name === "MiniCssExtractPlugin"
  );
  if (miniCssExtractPlugin) {
    miniCssExtractPlugin.options.filename = "static/css/[name].css";
    miniCssExtractPlugin.options.chunkFilename = "static/css/[name].css";
  }

  return config;
};
