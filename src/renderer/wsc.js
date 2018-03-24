// const WebSocket = require('ws')
let WebSocket = window.WebSocket

function AnyproxyWsUtil (config) {
  config = config || {}
  if (!WebSocket) {
    throw (new Error('webSocket is not available on this browser'))
  }

  const self = this
  const baseUrl = config.baseUrl || 'ws://localhost:8002/do-not-proxy'

  const dataSocket = new WebSocket(baseUrl)

  self.bodyCbMap = {}

  dataSocket.onmessage = function (event) {
    config.onGetData && config.onGetData.call(self, event.data)

    try {
      const data = JSON.parse(event.data)
      let type = data.type
      let content = data.content

      if (type === 'updateLatestWsMsg') {
        config.onUpdateLatestWsMsg && config.onUpdateLatestWsMsg.call(self, content)
      } else if (type === 'updateMultiple') {
        config.onupdateMultiple && config.onupdateMultiple.call(self, content)
      }
    } catch (e) {
      console.log('err')
      config.onError && config.onError.call(self, new Error('failed to parse socket data - ' + e.toString()))
    }
  }

  dataSocket.onopen = function (e) {
    config.onOpen && config.onOpen.call(self, e)
  }
  dataSocket.onclose = function (e) {
    config.onClose && config.onClose.call(self, e)
  }
  dataSocket.onerror = function (e) {
    config.onError && config.onError.call(self, e)
  }

  self.dataSocket = dataSocket
  return dataSocket
}

AnyproxyWsUtil.prototype.send = function (data) {
  if (typeof data === 'object') {
    data = JSON.stringify(data)
  }
  this.dataSocket.send(data)
}

AnyproxyWsUtil.prototype.reqBody = function (id, callback) {
  if (!id) return

  const payload = {
    type: 'reqBody',
    id: id
  }
  if (callback) {
    const reqRef = 'r_' + Math.random() * 100 + '_' + (new Date().getTime())
    payload.reqRef = reqRef
    this.bodyCbMap[reqRef] = callback
  }
  this.send(payload)
}
export default AnyproxyWsUtil
