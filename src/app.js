const Vue = require('vue');
import App from './App';
import { createRouter } from './router';

export function createApp() {
  const router = createRouter();
  const app = new Vue({
    router,
    render: (h) => h(App),
  });
  return { app, router };
}
