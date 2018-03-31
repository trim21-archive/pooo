import AnyproxyWsUtil from './wsc'
import Vue from 'vue'

let wsMsgs = []

const renderBus = new Vue({
  data () {
    return {
      proxyStatus: false
    }
  }
})

function checkIfWebsocketConnect (msg) {
  return msg.resHeader.hasOwnProperty('connection') && msg.resHeader.connection === 'Upgrade' &&
    msg.resHeader.hasOwnProperty('upgrade') && msg.resHeader.upgrade === 'websocket'
}

const options = {
  baseUrl: 'ws://localhost:8002/do-not-proxy',
  onOpen: function () {
    console.log('connection established')
  },
  onUpdateLatestWsMsg (record) {
    let message = record.message.message
    if (message.startsWith('42')) {
      message = message.substr(2)
      try {
        message = JSON.parse(message)
        if (message[0] === 'raid' && message[1].hasOwnProperty('bossUpdate')) {
          renderBus.$emit('boss-update', message)
        } else {
          console.log(message[0])
        }
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
        // if (checkIfAttack(msg)) renderBus.$emit('attack', msg)
        // if (checkIfSkill(msg)) renderBus.$emit('skill', msg)
        // if (checkJoinRaid(msg)) renderBus.$emit('join-battle', JSON.parse(msg.resBody))
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
