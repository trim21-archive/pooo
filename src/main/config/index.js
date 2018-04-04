import { app } from 'electron'
import fs from 'fs'
import path from 'path'

let config = {
  // 游戏的主要数据接口
  apiHostNames: [
    'game.granbluefantasy.jp',
    'gbf.game.mbga.jp'
  ],

  // 本地代理的端口
  port: 8001,
  webInterface: true, // 是否启用 anyProxy 的 web 界面
  webPort: 8002, // anyProxy 的 web 界面端口

  // 是否解析 https 请求
  proxyHttps: false,
  DEBUG: Boolean(process.env.debug),
  // 是否使用前置代理
  frontAgent: false,
  frontAgentHost: '127.0.0.1',
  frontAgentPort: 8123
}
const configPath = path.resolve(app.getPath('userData'), 'config.json')
if (fs.existsSync(configPath)) {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
}

export default config
