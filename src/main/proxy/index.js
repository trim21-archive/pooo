import AnyProxy from 'anyproxy'
import rule from './rule'
import CONFIG from '../config/index'

function startProxy (ready) {
  const options = {
    port: CONFIG.port,
    wsIntercept: true,
    rule,
    webInterface: {
      enable: CONFIG.webInterface,
      webPort: CONFIG.webPort
    },
    silent: true
  }

  const proxyServer = new AnyProxy.ProxyServer(options)

  proxyServer.on('ready', () => {
    console.log('ready')
    if (ready) {
      ready()
    }
  })

  proxyServer.on('error', (e) => {
  })

  proxyServer.start()
}

export default startProxy
