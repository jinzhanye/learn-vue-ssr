/* server-bundle 热更新配置 */
const fs = require('fs');
const path = require('path');
const MFS = require('memory-fs');
const webpack = require('webpack');
const chokidar = require('chokidar');
const clientConfig = require('./webpack.client.config');
const serverConfig = require('./webpack.server.config');

const readFile = (fs, file) => {
  try {
    // clientConfig.output.path 实际上是指向 webpack.base.config 的 output.path
    return fs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8')
  } catch (e) {
    //
  }
};

module.exports = function setupDevServer(app, templatePath, cb) {
  let bundle;// 服务端打包
  let template; // index.html 模版
  let clientManifest;// 客户端包信息

  let ready;
  const readyPromise = new Promise(resolve => {ready = resolve;});
  const update = () => {
    if (bundle && clientManifest) {
      ready();
      cb(bundle, {
        template,
        clientManifest,
      });
    }
  };

  /***
   *  配置模版热更新
   * ****/
  // read template from disk and watch
  template = fs.readFileSync(templatePath, 'utf-8');
  // chokidar.wathch 用于监听模版文件变化
  // 每次编辑模版文件后都重新打包热更新
  chokidar.watch(templatePath).on('change', () => {
    template = fs.readFileSync(templatePath, 'utf-8');
    console.log('index.html template update.');
    update();
  });

  /***
   *  配置客户端热更新
   * ****/
  clientConfig.entry.app = ['webpack-hot-middleware/client', clientConfig.entry.app];
  clientConfig.output.filename = '[name].js';
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  );

  // dev middleware
  const clientCompiler = webpack(clientConfig);
  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    noInfo: true,
  });
  app.use(devMiddleware);
  // 每次编译完成后热更新客户端
  clientCompiler.plugin('done', stats => {
    stats = stats.toJson();
    stats.errors.forEach(err => console.error(err));
    stats.warnings.forEach(err => console.warn(err));
    if (stats.errors.length)
      return;
    clientManifest = JSON.parse(readFile(
      devMiddleware.fileSystem,
      'vue-ssr-client-manifest.json',
    ));
    update();
  });
  // hot middleware
  app.use(require('webpack-hot-middleware')(clientCompiler, { heartbeat: 5000 }));

  /***
   *  配置服务端热更新
   * ****/
  const serverCompiler = webpack(serverConfig);
  const mfs = new MFS();
  serverCompiler.outputFileSystem = mfs;
  serverCompiler.watch({}, (err, stats) => {
    if (err) {
      throw err;
    }
    stats = stats.toJson();

    if (stats.errors.length) {
      return;
    }

    bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'));
    update();
  });

  return readyPromise;
};
