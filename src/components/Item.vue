<template>
    <div>
        {{item.collectionCount}}收藏 | {{item.commentsCount}}评论
    </div>
</template>

<script>
export default {
  name: 'Item',
  props: ['item'],
  asyncData({ store, route }) {
    // asyncData 无法访问 this
    // 触发 action 后，会返回 Promise
    // return store.dispatch('fetchItem', route.params.id);
  },
  computed: {
    // 从 store 的 state 对象中的获取 item。
    item() {
      // return this.$store.state.items[this.$route.params.id];
    }
  },
}
</script>

<style scoped>

</style>
