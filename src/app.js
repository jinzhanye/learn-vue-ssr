const Vue = require('vue');
import App from './App';
import { createRouter } from './router';
import { createStore } from './store';
import { sync } from 'vuex-router-sync';

export function createApp() {
  const router = createRouter();
  const store = createStore();

  // TODO ???
  sync(store, router);

  const app = new Vue({
    store,
    router,
    render: (h) => h(App),
  });

  return { app, router, store };
}
