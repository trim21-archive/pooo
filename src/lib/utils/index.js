import fs from 'fs'
import log from 'electron-log'

function ensureExists (path, cb) {
  fs.mkdir(path, function (err) {
    if (err) {
      if (err.code !== 'EEXIST') {
        log.error(err)
      }
    }
  })
}

export default {
  ensureExists
}
