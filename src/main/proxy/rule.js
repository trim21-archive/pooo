import CONFIG from '../../config.js'

const apiHostNames = CONFIG.apiHostNames
module.exports = {
  // * beforeSendRequest (requestDetail) {
  //   return requestDetail
  // },
  // async beforeSendResponse (requestDetail, responseDetail) {
    // const uri = URI(requestDetail.url)
    // let result = responseDetail
    // if (apiHostNames.includes(uri.hostname())) {
    //   const path = uri.path()
    //
    //   if (path === '/rest/raid/normal_attack_result.json') {
    //     console.log('attack')
    //     let attackDamage = damageStatics.parseAttackDamage(JSON.parse(result.response.body.toString()))
    //     bus.$emit('attack', attackDamage)
    //   }
    //   if (path === '/rest/raid/ability_result.json') {
    //     console.log('skill')
    //     let skillDamage = damageStatics.parseSkillDamage(JSON.parse(result.response.body.toString()))
    //     bus.$emit('skill', skillDamage)
    //   }
    // }
    // return responseDetail
  // },
  // * beforeDealHttpsRequest (requestDetail) {
  //   return CONFIG.proxyHttps
  // }
}
