import { ipcRenderer } from 'electron'

const state = {
  running: false,
  starting: false
}

const mutations = {
  PROXY_STARTING (state) {
    state.starting = true
  },
  PROXY_STARTED (state) {
    state.starting = false
    state.running = true
  }
}

const actions = {
  startAnyProxy (context) {
    if (context.state.running || context.state.starting) {
    } else {
      console.log('starting proxy')
      context.commit('PROXY_STARTING')
      ipcRenderer.once('proxy-ready', () => {
        context.commit('PROXY_STARTED')
      })
      ipcRenderer.send('start-proxy')
    }
  }
}

export default {
  state,
  mutations,
  actions
}
