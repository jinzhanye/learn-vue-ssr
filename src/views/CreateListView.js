import ItemList from './ItemList.vue';

const camelize = str => str.charAt(0).toUpperCase() + str.slice(1);

// 工厂函数动态生成 list 页面
// list页面除了type不同之外，业务逻辑都是相同的
export default function createListView(type) {
  return {
    name: `${type}-view`,

    asyncData({ store }) {
      return store.dispatch('FETCH_LIST_DATA', { type });
    },

    title: camelize(type),

    render(h) {
      return h(ItemList, { props: { type } });
    }
  };
}
