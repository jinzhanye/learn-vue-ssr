<template>
    <li class="news-item">
    <span class="title">
      <a :href="item.originalUrl" target="_blank" rel="noopener">{{ item.title }}</a>
    </span>
        <br>
        <span class="meta">
      <span>
        {{item.collectionCount}}收藏 | {{item.commentsCount}}评论
      </span>
    </span>
        <p>{{item.content}}</p>
    </li>
</template>

<script>
export default {
  name: 'Item',
  props: ['item'],
}
</script>

<style lang="stylus">
.news-item
    background-color #fff
    padding 20px 30px 20px
    border-bottom 1px solid #eee
    position relative
    line-height 20px
    .title
        font-weight 700
    .meta, .host
        font-size .85em
        color #828282
        .tag
            border 1px solid #828282
            border-radius 2px
            margin-right 10px
        a
            color #828282
            text-decoration underline
            &:hover
                color #ff6600
</style>
