import CONFIG from '../config/index.js'
import bus from '../bus'
import URI from 'urijs'
import fs from 'fs'
import path from 'path'

const apiHostNames = CONFIG.apiHostNames

module.exports = {
  * beforeSendRequest (requestDetail) {
    const newRequestOptions = requestDetail.requestOptions
    if (CONFIG.frontAgent) {
      newRequestOptions.hostname = CONFIG.frontAgentHost
      newRequestOptions.port = CONFIG.frontAgentPort
      newRequestOptions.path = requestDetail.url
    }
    return requestDetail
  },
  async beforeSendResponse (requestDetail, responseDetail) {
    const uri = URI(requestDetail.url)
    let result = responseDetail
    let type
    let content = result.response.body.toString()
    if (apiHostNames.includes(uri.hostname())) {
      const urlPath = uri.path()

      if (urlPath === '/rest/raid/normal_attack_result.json' || urlPath === '/rest/multiraid/normal_attack_result.json') {
        content = JSON.stringify(JSON.parse(content), null, 4)
        if (CONFIG.DEBUG) {
          console.log('attack')
          fs.writeFile(path.join(__dirname, `../../../log/attack/${new Date().getTime()}.json`), content, err => {
            console.error(err)
          })
        }
        type = 'attack'
      }
      if (urlPath === '/rest/raid/ability_result.json' || urlPath === '/rest/multiraid/ability_result.json') {
        content = JSON.stringify(JSON.parse(content), null, 4)
        type = 'skill'
        if (CONFIG.DEBUG) {
          console.log('skill')
          fs.writeFile(path.join(__dirname, `../../../log/skill/${new Date().getTime()}.json`), content, err => {
            console.error(err)
          })
        }
      }
      if (urlPath === '/rest/multiraid/start.json' || urlPath === '/rest/raid/start.json') {
        content = JSON.stringify(JSON.parse(content), null, 4)
        type = 'join-battle'
        if (CONFIG.DEBUG) {
          console.log('join-battle')
          fs.writeFile(path.join(__dirname, `../../../log/start/${new Date().getTime()}.json`), content, err => {
            console.error(err)
          })
        }
      }
      if (urlPath.startsWith('/multiraid/content/index')) {
        content = JSON.stringify(JSON.parse(content), null, 4)

        type = 'enter-multiraid'
        let s = urlPath.split('/')
        content = {
          id: s[s.length - 1]
        }
      }
      if (type) bus.$emit('http', {type, content})
    }
    return responseDetail
  }
  // * beforeDealHttpsRequest (requestDetail) {
  //   return CONFIG.proxyHttps
  // }
}
