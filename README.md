# pooo

碧蓝幻想 抓包分析器
基于anyproxy,在electron的render进程中使用ws连接anyproxy提供的ws server,获取到所有经过anyproxy的数据包

本身只进行抓包,而不进行任何的数据修改和代替客户端发包

## Build Setup

如果你想自己手动构建,请先安装[nodejs](https://nodejs.org/zh-cn/)

``` bash
# 安装依赖
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# lint all JS/Vue component files in `src/`
npm run lint

```

## 使用

在浏览器插件中代理以下两个域名

```
*.granbluefantasy.jp
203.104.248.5
```

进入战斗后,浏览器会与此ip地址进行socket.io的通信,不加入代理无法根据血量提醒特动.

## 贡献

使用[standardjs](https://standardjs.com/)进行lint


boss的数据在[src/lib/bossAction/boss](https://github.com/Trim21/pooo/tree/master/src/lib/bossAction/boss)中,以`start.json`中的`boss.param[0].name.en`来命名.

### EventEmitter: 

render进程中的`ipcRenderer`,main进程中的`ipcMain`,用于main进程与render进程的通信,目前只用于保存config和启动启动代理服务器.

render进程中的`src/renderer/renderBus.js`,目前有两个事件:`boss-update`和`start-wsc`.`boss-update`用于在boss状态更新时进行广播,`start-wsc`用于在代理服务器成功启动之后通知websocket客户端连接到anyproxy提供的控制面板.

main进程中的`src/main/bus.js`,目前只负责在代理`src/main/proxy/rule.js`与`src/main/index.js`中进行通信.`bus`只绑定了一个事件`http`,在`rule.js`中进行广播,`main.js`中进行接收,然后通过`mainWindow.webContents`广播到前端.
