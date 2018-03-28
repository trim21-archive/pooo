import CONFIG from '../../config.js'
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

      if (urlPath === '/rest/raid/normal_attack_result.json') {
        content = JSON.stringify(JSON.parse(content), null, 4)
        console.log('attack')
        fs.writeFile(path.join(__dirname, `../../../log/attack/${new Date().getTime()}.json`), content, err => {
          console.error(err)
        })
        type = 'attack'
      }
      if (urlPath === '/rest/raid/ability_result.json') {
        content = JSON.stringify(JSON.parse(content), null, 4)

        console.log('skill')
        type = 'skill'
        fs.writeFile(path.join(__dirname, `../../../log/skill/${new Date().getTime()}.json`), content, err => {
          console.error(err)
        })
      }
      if (urlPath === '/rest/multiraid/start.json') {
        content = JSON.stringify(JSON.parse(content), null, 4)

        console.log('join-battle')
        type = 'join-battle'
        fs.writeFile(path.join(__dirname, `../../../log/start/${new Date().getTime()}.json`), content, err => {
          console.error(err)
        })
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
