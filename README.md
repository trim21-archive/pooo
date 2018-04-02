# pooo

碧蓝幻想 抓包分析器
基于anyproxy,在electron的render进程中使用ws连接anyproxy提供的ws server,获取到所有经过anyproxy的数据包

本身只进行抓包,而不进行任何的数据修改和代替客户端发包

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


# lint all JS/Vue component files in `src/`
npm run lint

```

## 使用

在设置选项卡中设置好对应端口,然后代理gbf的数据

前端的demo页面中可以看到攻击和施放技能的相应时间 (需要先打开pooo再进入战斗,才能获取到boss信息)

刷新帮助目前只能正确处理单头怪,不支持多头怪的处理(毕竟超巴也没多头)

多人战中的boss数据更新是通过一个socket.io链接进行的 目前链接的地址是
`ws://203.104.248.5:11230/socket.io/`
一般情况下是保持在ws链接,当ws连接不可用的时候会降级成长轮询
 需要加入代理才能自动提醒特动
