const fs = require('fs');
const path = require('path');
const LRU = require('lru-cache');
const express = require('express');
const favicon = require('serve-favicon');
const compression = require('compression');
const microcache = require('route-cache');
const resolve = file => path.resolve(__dirname, file);
const { createBundleRenderer } = require('vue-server-renderer');
const axios = require('axios');
const websiteConfig = require('./src/config/website');

const isProd = process.env.NODE_ENV === 'production';
const useMicroCache = process.env.MICRO_CACHE !== 'false';

// 获取相关版本信息
// express/[express版本号] vue-server-renderer/[vue-server-renderer版本号]
const serverInfo =
  `express/${require('express/package.json').version} ` +
  `vue-server-renderer/${require('vue-server-renderer/package.json').version}`;

const app = express();

function createRenderer(bundle, options) {
  return createBundleRenderer(bundle, Object.assign(options, {
    // for component caching
    cache: LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15
    }),
    // this is only needed when vue-server-renderer is npm-linked
    basedir: resolve('./dist'),
    // recommended for performance
    runInNewContext: false
  }));
}

let renderer;
let readyPromise;
const templatePath = resolve('./src/index.template.html');
if (isProd) {
  const template = fs.readFileSync(templatePath, 'utf-8');
  const bundle = require('./dist/vue-ssr-server-bundle.json');
  const clientManifest = require('./dist/vue-ssr-client-manifest.json');
  renderer = createRenderer(bundle, {
    template,
    clientManifest,
  });
} else {
  readyPromise = require('./build/setup-dev-server')(
    app,
    templatePath,
    (bundle, options) => {
      console.log('bundle callback..');
      render = createRenderer(bundle, options);
    },
  );
}

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0,
});

// 静态资源配置
app.use(compression({ threshold: 0 })); // 使用 Gzip 压缩
app.use(favicon('./public/logo-48.png'));
app.use('/dist', serve('./dist', true));
app.use('/public', serve('./public', true));
app.use('/manifest.json', serve('./manifest.json', true));

// since this app has no user-specific content, every page is micro-cacheable.
// if your app involves user-specific content, you need to implement custom
// logic to determine whether a request is cacheable based on its url and
// headers.
// 1-second microcache.
// https://www.nginx.com/blog/benefits-of-microcaching-nginx/
// 路由缓存??
app.use(microcache.cacheSeconds(1, req => useMicroCache && req.originalUrl));

function render(req, res) {
  const s = Date.now();

  res.setHeader("Content-Type", "text/html");
  res.setHeader("Server", serverInfo);

  const handleError = err => {
    if (err.url) {
      res.redirect(err.url);
    } else if (err.code === 404) {
      res.status(404).send('404 | Page Not Found');
    } else {
      // Render Error Page or Redirect
      res.status(500).send('500 | Internal Server Error');
      console.error(`error during render : ${req.url}`);
      console.error(err.stack);
    }
  };

  const context = {
    title: '掘金',
    url: req.url,
  };

  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err);
    }
    res.send(html);
    if (!isProd) {
      // 本次请求用时
      console.log(`whole request: ${Date.now() - s}ms`)
    }
  });
}

app.get('/v1/get_entry_by_rank', (req, res) => {
  console.log(req.url);
  axios({
    method: 'get',
    url: websiteConfig.host + req.url,
    responseType: 'stream'
  }).then(response => {
    // console.log(response);
    response.data.pipe(res);
  }).catch(err => {
    console.error(err);
    res.status(500).send('500 | Internal Server Error')
  });
});

app.get('*', isProd ? render : (req, res) => {
  readyPromise.then(() => render(req, res));
});

const port = process.env.PORT || 7888;
app.listen(port, () => {
  console.log(`server started at localhost:${port}`);
});
