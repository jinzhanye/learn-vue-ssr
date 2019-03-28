import Vue from 'vue';
import Router from 'vue-router';

const ItemList = () => import('../views/ItemList.vue');

Vue.use(Router);

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      { path: '/', component: ItemList },
    ]
  });
}

