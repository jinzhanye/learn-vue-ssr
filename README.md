> 参考 [vnews](https://github.com/tiodot/vnews) 做的小项目，删除PWA
## Question
- App 里哪些内容打包到 client，哪些内容打包到 server
- server 与 client 同样引用了 createApp，当组件发生变化时程序是怎么知道重新打包 server 还是 client。
- 为什么不创建一个路由然后将type以params的形式传入，而是动态创建多个路由
- 为什么如果 app.get('/v1/get_entry_by_rank') 放在 app.get('*'）后面，点击 next 就会请求失败 
