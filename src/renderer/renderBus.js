import AnyproxyWsUtil from './wsc'

import Vue from 'vue'

let wsMsgs = []

const renderBus = new Vue({})

function checkIfWebsocketConnect (msg) {
  return msg.resHeader.hasOwnProperty('connection') && msg.resHeader.connection === 'Upgrade' &&
    msg.resHeader.hasOwnProperty('upgrade') && msg.resHeader.upgrade === 'websocket'
}

function checkIfAttack (msg) {
//  `http://game.granbluefantasy.jp/rest/raid/normal_attack_result.json?_=${timestamp}&t=${unknown}&uid=${user id}`
  return msg.path.startsWith('/rest/raid/normal_attack_result.json')
}

function checkIfSkill (msg) {
// `http://game.granbluefantasy.jp/rest/raid/ability_result.json?_=${timestamp}&t=${unknown}&uid=${user id}`
  return msg.path.startsWith('/rest/raid/ability_result.json')
}

const options = {
  baseUrl: 'ws://localhost:8002/do-not-proxy',
  onOpen: function () {
    console.log('connection stablished')
  },
  onUpdateLatestWsMsg (record) {
    let message = record.message.message
    if (message.startsWith('42')) {
      message = message.substr(2)
      try {
        message = JSON.parse(message)
        console.log('boss status update')
      } catch (e) {
        console.log(message)
      }
    }
  },
  onupdateMultiple: function (record) {
    // get an updated record
    for (let msg of record) {
      if (msg.resHeader) {
        // only search in response
        if (checkIfWebsocketConnect(msg)) {
          wsMsgs.push(msg)
          console.log('new ws connection')
        }
        if (checkIfAttack(msg)) renderBus.$emit('attack')
        if (checkIfSkill(msg)) renderBus.$emit('skill')
      }
    }
  },
  onError: function (e) {
    console.log('an error occurred :' + e)
  },
  onClose: function (e) {
    console.log('connection closed')
  }
}

renderBus.$on('start-wsc', function () {
  /* eslint-disable no-new */
  new AnyproxyWsUtil(options)
})

export default renderBus
