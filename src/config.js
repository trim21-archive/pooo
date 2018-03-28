import mkdirp from 'mkdirp'

import fs from 'fs'

import path, { dirname } from 'path'

import { app } from 'electron'

let USER_DATA_PATH = app
  ? path.resolve(app.getPath('userData'))
  : path.resolve(process.cwd(), 'userData')
const config = {
  // 游戏的主要数据接口
  apiHostNames: ['game.granbluefantasy.jp', 'gbf.game.mbga.jp'],

  // 本地代理的端口
  port: 8001,
  webInterface: true, // 是否启用 anyProxy 的 web 界面
  webPort: 8002, // anyProxy 的 web 界面端口

  // 是否解析 https 请求
  proxyHttps: false,

  // 是否使用前置代理
  frontAgent: true,
  frontAgentHost: '127.0.0.1',
  frontAgentPort: 8123
}

const LOCAL_CONFIG_PATH = path.resolve(USER_DATA_PATH, 'config.json')

const getLocalConfig = () => {
  let localConfig = {}
  try {
    const buffer = fs.readFileSync(LOCAL_CONFIG_PATH)
    localConfig = JSON.parse(buffer.toString())
  } catch (err) {
    if (err.code === 'ENOENT') {
      mkdirp(dirname(LOCAL_CONFIG_PATH), (err) => {
        if (err) return
        fs.writeFileSync(LOCAL_CONFIG_PATH, JSON.stringify(config, null, 2))
      })
    }
  }

  Object.assign(config, localConfig)
}

getLocalConfig()

export default config
