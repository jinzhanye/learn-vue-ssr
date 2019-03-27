const createApp = require('./src/app');
const server = require('express')();
const renderer = require('vue-server-renderer').createRenderer({
  template: require('fs').readFileSync('./index.template.html', 'utf-8'),
});

server.get('*', (req, res) => {
  const context = { url: req.url };
  createApp(context).then(app=>{
    renderer.renderToString(app, {
      title: 'Hello',
      meta: `<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">
           <meta http-equiv="x-dns-prefetch-control" content="on">`,
    }, (err, html) => {
      if (err) {
        if (err.code === 404) {
          res.status(404).end('Page not found');
        } else {
          res.status(500).end('Internal Server Error');
        }
        return;
      }
      res.end(html);
    });
  });
});

server.listen(7888);
