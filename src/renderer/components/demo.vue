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
            <code>{{bossName}}</code>
            <code>{{battleID}}</code>
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
        proxyStatus: renderBus.proxyStatus,
        battleID: '',
        bossName: '',
        messages: [{text: 'start'}],
        battleData: {}
      }
    },
    mounted () {
      const vm = this
      ipcRenderer.on('http', (e, data) => {
        if (data.type === 'attack') {
          console.log(data.type)
          vm.messages.push({text: 'attack'})
        }

        if (data.type === 'skill') {
          console.log(data.type)
          vm.messages.push({text: 'skill'})
        }
        if (data.type === 'enter-multiraid') {
          if (this.ifNewBattle(data.content.id)) {
            vm.messages = [{text: 'new battle'}]
            vm.battleID = data.content.id
          }
          vm.messages.push({text: data.content.id})
        }
        if (data.type === 'join-battle') {
          let content = JSON.parse(data.content)
          console.log(content.boss)
          vm.bossName = content.boss.param[0].name.en
          vm.messages.push(
            {text: `join battle: ${vm.bossName}`}
          )
        }
      })
    },
    methods: {
      ifNewBattle (battleID) {
        return battleID !== this.battleID
      },
      startProxy () {
        let vm = this
        this.started = true
        renderBus.proxyStatus = true
        this.proxyStatus = '启动中'
        let status = ipcRenderer.sendSync('start-proxy')
        if (status === 'starting') {
          vm.$message('启动中')
          ipcRenderer.on('proxy-ready', function (da) {
            vm.onceStarted = true
            renderBus.$emit('start-wsc')
          })
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
