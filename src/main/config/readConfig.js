import CONFIG from './index'
import path, { dirname } from 'path'
import { app } from 'electron'
import mkdirp from 'mkdirp'
import fs from 'fs'

let USER_DATA_PATH = app
  ? path.resolve(app.getPath('userData'))
  : path.resolve(process.cwd(), 'userData')
const LOCAL_CONFIG_PATH = path.resolve(USER_DATA_PATH, 'config.json')

const getLocalConfig = () => {
  let localConfig = {}
  try {
    const buffer = fs.readFileSync(LOCAL_CONFIG_PATH)
    localConfig = JSON.parse(buffer.toString())
  } catch (err) {
    if (err.code === 'ENOENT') {
      mkdirp(dirname(LOCAL_CONFIG_PATH), err => {
        if (err) return
        fs.writeFileSync(LOCAL_CONFIG_PATH, JSON.stringify(CONFIG, null, 2))
      })
    }
  }
  Object.assign(CONFIG, localConfig)
}

getLocalConfig()
export default {
  USER_DATA_PATH,
  LOCAL_CONFIG_PATH,
  getLocalConfig
}
