const Vue = require('vue');
const server = require('express')();
const renderer = require('vue-server-renderer').createRenderer({
  template: require('fs').readFileSync('./index.template.html', 'utf-8'),
});

server.get('*', (req, res) => {
  const app = new Vue({
    data: {
      url: req.url
    },
    template: '<div>request url is {{ url }}</div>',
  });

  const contex = {
    title: 'Hello',
    meta: `<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">
           <meta http-equiv="x-dns-prefetch-control" content="on">`,
  };
  renderer.renderToString(app, contex, (err, html) => {
    if (err) {
      res.status(500).end('Internal Server Error');
      return;
    }
    res.end(html);
  });
});

server.listen(7888);
