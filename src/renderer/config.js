import { remote } from 'electron'
import fs from 'fs'
import path from 'path'
const configPath = path.resolve(remote.app.getPath('userData'), 'config.json')
let config = {}
if (fs.existsSync(configPath)) {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
} else {
  config = {
    'apiHostNames': [
      'game.granbluefantasy.jp',
      'gbf.game.mbga.jp'
    ],
    'port': 8001,
    'webInterface': true,
    'webPort': 8002,
    'forceProxyHttps': false,
    'wsIntercept': true,
    'frontAgent': false,
    'frontAgentHost': '127.0.0.1',
    'frontAgentPort': 8123,
    'DEBUG': Boolean(process.env.debug)
  }
  fs.writeFile(JSON.stringify(config, null, 2), err => {
    console.log(err)
  })
}

export default config
