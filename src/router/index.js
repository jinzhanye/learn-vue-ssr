import Vue from 'vue';
import Router from 'vue-router';

const Home = () => import('../components/Home');
const Item = () => import('../components/Item');


Vue.use(Router);

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      { path: '/', component: Home },
      { path: '/item/:id', component: Item }
    ]
  });
}

