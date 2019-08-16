// vue-hackernews-2.0的setup-dev-server文件中文注释版
// const fs = require("fs");
// const path = require("path");
// 一个内存文件系统
// const MFS = require("memory-fs");
// const webpack = require("webpack");
// 监视文件, 文件目录修改的库
// const chokidar = require("chokidar");
// 客户端的配置文件
// const clientConfig = require("./webpack.client.config");
// 服务端的配置文件
// const serverConfig = require("./webpack.server.config");

// const readFile = (fs, file) => {
//   try {
//     return fs.readFileSync(path.join(clientConfig.output.path, file), "utf-8");
//   } catch (e) {}
// };

// app express的实例
// templatePath 静态html的路径
// cb 会返回一个renderer
// module.exports = function setupDevServer(app, templatePath, cb) {
//   let bundle;
//   let template;
//   let clientManifest;

//   let ready;
//   const readyPromise = new Promise(r => {
//     ready = r;
//   });

//   const update = () => {
//     if (bundle && clientManifest) {
//       ready();
//       cb(bundle, {
//         template,
//         clientManifest
//       });
//     }
//   };

//   // 读取模版文件
//   template = fs.readFileSync(templatePath, "utf-8");
//   // 监听模版文件的变化
//   chokidar.watch(templatePath).on("change", () => {
//     template = fs.readFileSync(templatePath, "utf-8");
//     // 根据新的模版，重新返回一个新的render
//     update();
//   });

//   // webpack-hot-middleware 在没有webpack-dev-server的情况下
//   // 将热加载功能，添加到现有的服务器上
//   // 1. 将插件添加到plugins数组中
//   // 2. 将webpack-hot-middleware/client添加到entry数组中
//   // 3. 添加到服务器中
//   // app.use(require("webpack-dev-middleware")(compiler, {
//   //   noInfo: true, publicPath: webpackConfig.output.publicPath
//   // }));
//   // 添加热加载功能
//   clientConfig.entry.app = [
//     "webpack-hot-middleware/client",
//     clientConfig.entry.app
//   ];
//   clientConfig.output.filename = "[name].js";
//   clientConfig.plugins.push(
//     new webpack.HotModuleReplacementPlugin(),
//     new webpack.NoEmitOnErrorsPlugin()
//   );

//   // dev middleware
//   const clientCompiler = webpack(clientConfig);
//   // 添加到现有服务器上
//   const devMiddleware = require("webpack-dev-middleware")(clientCompiler, {
//     publicPath: clientConfig.output.publicPath,
//     noInfo: true
//   });
//   // 监听到先用服务器上
//   app.use(devMiddleware);

//   // 这里应该监听的是，webpack插件返回的事件的监听
//   // 具体细节不是特别了解
//   clientCompiler.plugin("done", stats => {
//     stats = stats.toJson();
//     stats.errors.forEach(err => console.error(err));
//     stats.warnings.forEach(err => console.warn(err));
//     if (stats.errors.length) return;
//     clientManifest = JSON.parse(
//       readFile(devMiddleware.fileSystem, "vue-ssr-client-manifest.json")
//     );
//     update();
//   });

//   app.use(
//     require("webpack-hot-middleware")(clientCompiler, { heartbeat: 5000 })
//   );

//   // 这里应该监听的是，webpack插件返回的事件的监听
//   // 具体细节不是特别了解
//   const serverCompiler = webpack(serverConfig);
//   const mfs = new MFS();
//   serverCompiler.outputFileSystem = mfs;
//   serverCompiler.watch({}, (err, stats) => {
//     if (err) throw err;
//     stats = stats.toJson();
//     if (stats.errors.length) return;
//     bundle = JSON.parse(readFile(mfs, "vue-ssr-server-bundle.json"));
//     update();
//   });

//   return readyPromise;
// };
