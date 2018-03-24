<template>
    <div id="demo">
        <div v-if="!started">

        <span class="title">
          Welcome!
        </span>
            <el-button @click="startProxy">开启代理</el-button>
        </div>
        <div v-else>
            proxy running
            <el-button @click="open('http://localhost:8002')
">控制面板
            </el-button>

            <el-button @click="stopProxy">关闭代理</el-button>

            <ul class="list-group">
                <li v-for="message in messages" class="list-group-item">
                    {{ message.text }}
                </li>
            </ul>

        </div>
    </div>
</template>

<script>
  import { ipcRenderer, shell } from 'electron'
  import renderBus from '../renderBus'

  export default {
    name: 'demo',
    data () {
      return {
        onceStarted: false,
        started: false,
        proxyStatus: '',
        messages: [{text: 'start'}]
      }
    },
    methods: {
      startProxy () {
        let vm = this
        this.started = true
        this.proxyStatus = '启动中'
        let status = ipcRenderer.sendSync('start-proxy')
        if (status === 'starting') {
          vm.$message('启动中')
          if (vm.onceStarted) return
          ipcRenderer.on('proxy-ready', function (da) {
            this.proxyStatus = '启动完成,运行中'

            renderBus.$on('attack', () => {
              vm.messages.push({text: 'attack'})
            })
            renderBus.$on('skill', () => {
              vm.messages.push({text: 'skill'})
            })
            renderBus.$emit('start-wsc')
            vm.onceStarted = true
          })
        } else {
          vm.$message('error')
        }
      },
      stopProxy () {
        this.started = false
        ipcRenderer.send('stop-proxy')
      },
      open: shell.openExternal
    }
  }
</script>

<style>

</style>
