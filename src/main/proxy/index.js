import AnyProxy from 'anyproxy'
import bus from '../../bus'

const options = {
  port: 8001,
  wsIntercept: true,
  webInterface: {
    enable: true,
    webPort: 8002
  },
  silent: true
}

const proxyServer = new AnyProxy.ProxyServer(options)

proxyServer.on('ready', () => {
  bus.$emit('proxy-ready')
})

proxyServer.on('error', (e) => { })

// module.exports = proxyServer

export default proxyServer
