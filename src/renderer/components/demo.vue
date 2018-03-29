<template>
  <div id="demo">
    <div v-if="!$store.state.Proxy.running">

      <span class="title">
        Welcome!
      </span>
      <el-button @click="startProxy">开启代理</el-button>
    </div>
    <div v-else>
      proxy running
      <el-button @click="open('http://localhost:8002')">控制面板
      </el-button>

      <el-button @click="stopProxy">关闭代理</el-button>
      <code>{{bossName}}</code>
      <code>{{battleID}}</code>
      <ul class="list-group">
        <li v-for="(message, index) in messages" :key="index" class="list-group-item">
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
        proxyStatus: renderBus.proxyStatus,
        battleID: '',
        bossName: '',
        messages: [{text: 'start'}],
        battleData: {
          bossData: {}
        }
      }
    },
    mounted () {
      const vm = this
      ipcRenderer.on('http', (e, data) => {
        if (data.type === 'attack') {
          let content = JSON.parse(data.content)
          let scenario = content.scenario
          let bossHpAfterAttack
          for (let action of scenario) {
            if (action.cmd === 'attack') {
              let attack = action.damage[action.damage.length - 1]
              let latestDamageOfLastAttack = attack[attack.length - 1]
              bossHpAfterAttack = latestDamageOfLastAttack.hp
            }
            if (action.cmd === 'damage') {
              if (action.to === 'boss') {
                let chainBrust = action.list[action.list.length - 1]
                bossHpAfterAttack = chainBrust.hp
              }
            }
            if (action.cmd === 'turn') {
              break
            }
          }
          vm.messages.push({text: `攻击打到了(不算1爷反击) ${bossHpAfterAttack / vm.battleData.bossData.hpmax} %`})
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
          console.log(`boss number ${content.boss.param.length}`)
          if (content.boss.param.length === 1) {
            vm.bossName = content.boss.param[0].name.en
            vm.battleData.bossData = content.boss.param[0]
            vm.messages.push({text: `join battle: ${vm.bossName}`})
          } else {
            vm.messages = [{text: '多头怪暂不支持'}]
          }
        }
      })
    },
    methods: {
      ifNewBattle (battleID) {
        return battleID !== this.battleID
      },
      startProxy () {
        this.$store.dispatch('startAnyProxy')
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
