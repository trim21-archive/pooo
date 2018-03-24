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
使用时需要手动打开anyproxy的控制面板[http://localhost:8002](http://localhost:8002) 安装anyproxy提供的https证书 然后将浏览器的代理指向localhost:8001

目前代理端口是硬编码在代码中的,还不支持配置.

前端的demo页面中可以看到攻击和施放技能的相应时间,具体的数据可以通过Vue的emit和on传递(暂时没弄)

多人战中的boss数据更新是通过一个socket.io链接进行的 目前链接的地址是
`ws://203.104.248.5:11230/socket.io/`
一般情况下是保持在ws链接,当ws连接不可用的时候会降级成长轮询
请注意,将此ip地址也要代理,否则无法抓到boss的状态更新
