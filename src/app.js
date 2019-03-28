import Vue from 'vue';
import App from './App.vue';
import { createRouter } from './router';
import { createStore } from './store';
import { sync } from 'vuex-router-sync';

// 处理页面 title
// Vue.mixin(titleMixin)

// 注册 filter
// Object.keys(filters).forEach(key => {
//   Vue.filter(key, filters[key])
// })


export function createApp() {
  const router = createRouter();
  const store = createStore();

  // sync the router with the vuex store.
  // this registers `store.state.route`
  sync(store, router);

  const app = new Vue({
    store,
    router,
    render: (h) => h(App),
  });

  return { app, router, store };
}
