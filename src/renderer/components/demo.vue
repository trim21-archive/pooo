<template>
  <div id="demo">
    <div v-if="!$store.state.Proxy.running">

      <span class="title">
        Welcome!
      </span>
      <el-button @click="startProxy">开启代理</el-button>
    </div>
    <div v-else>
      <el-row>
        <code>目前只会显示超巴的特动</code>
        <el-switch v-model="voiceNotice" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-row>

      <el-row>
        <pre><code>上一个特动: {{ lastAction }}</code></pre>
      </el-row>
       <el-row>
        <pre><code>下一个特动: {{ nextAction }}</code></pre>
      </el-row>

     <el-row>
        <pre><code>普攻: {{ atk }}</code></pre>
      </el-row>
     <el-row>
        <pre><code>满豆: {{ np }}</code></pre>
      </el-row>



      <el-row>
        <ul class="list-group">
          <li v-for="(message, index) in messages" :key="index" class="list-group-item">
            {{ message.text }}
          </li>
        </ul>
      </el-row>

    </div>
  </div>
</template>

<script>
  import { ipcRenderer, shell } from 'electron'
  import renderBus from '../renderBus'
  import bossAction from '../../lib/bossAction'

  const audio = new window.Audio('static/audio/oh-finally.ogg')

export default {
    name: 'demo',
    data () {
      return {
        lastAction: 'pooo',
        nextAction: '',
        atk: '',
        np: '',
        battleID: '',
        bossName: '',
        voiceNotice: true,
        messages: [{text: 'start'}],
        battleData: {
          bossData: {}
        }
      }
    },
    mounted () {
      const vm = this
      renderBus.$on('boss-update', (message) => {
        vm.battleData.bossData.hp = message[1].bossUpdate.param.boss1_hp
        let lastMsg = vm.lastAction
        let {special, atk, np} = bossAction['Lvl 200 Ultimate Bahamut'].hp(vm.battleData.bossData)
        vm.lastAction = special.last
        vm.nextAction = special.next
        vm.atk = atk
        vm.np = np
        if (lastMsg !== vm.lastAction) {
          vm.playMusic()
        }
      })

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
          vm.messages.unshift({text: `攻击后血量 ${bossHpAfterAttack / vm.battleData.bossData.hpmax} %`})
          let atkDanger = bossAction['Lvl 200 Ultimate Bahamut'].atk(content)
          if (atkDanger) {
            vm.messages.unshift({text: atkDanger})
            this.playMusic()
          }
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
        }
        if (data.type === 'join-battle') {
          let content = JSON.parse(data.content)
          console.log(`boss number ${content.boss.param.length}`)
          if (content.boss.param.length === 1) {
            vm.bossName = content.boss.param[0].name.en
            vm.battleData.bossData = content.boss.param[0]
          } else {
            vm.messages = [{text: '多头怪暂不支持'}]
          }
        }
      })
    },
    methods: {
      playMusic () {
        if (this.voiceNotice) {
          audio.play()
        }
      },
      ifNewBattle (battleID) {
        return battleID !== this.battleID
      },
      startProxy () {
        this.$store.dispatch('startAnyProxy')
        renderBus.$emit('start-wsc')
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
