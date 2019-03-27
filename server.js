const createApp = require('./src/app');
const server = require('express')();
const renderer = require('vue-server-renderer').createRenderer({
  template: require('fs').readFileSync('./index.template.html', 'utf-8'),
});

server.get('*', (req, res) => {
  const context = {
    title: 'Hello',
    meta: `<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">
           <meta http-equiv="x-dns-prefetch-control" content="on">`,
  };
  const app = createApp({
    url: req.url,
  });

  renderer.renderToString(app, context, (err, html) => {
    if (err) {
      res.status(500).end('Internal Server Error');
      return;
    }
    res.end(html);
  });
});

server.listen(7888);
