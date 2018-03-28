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
            <el-button @click="open('http://localhost:8002')">控制面板
            </el-button>
            <p>暂时不会区分角色和战斗,不同战斗同一位置造成的伤害会累积</p>
            <el-button icon="el-icon-document" size="small" @click="clearStatics">清空</el-button>
            <el-table
                    :data="statics"
                    border
                    style="width: 100%">
                <el-table-column
                        prop="skill"
                        label="技能伤害"
                        width="90">
                </el-table-column>
                <el-table-column
                        prop="na"
                        label="平砍"
                        width="90">
                </el-table-column>
                <el-table-column
                        prop="ca"
                        label="奥义"
                        width="90">
                </el-table-column>
                <el-table-column
                        label="总计伤害"
                        width="90">
                    <template slot-scope="scope">
                        {{ scope.row.skill+scope.row.ca+scope.row.na }}
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
  import { ipcRenderer, shell } from 'electron'
  import damageStatics from '../../lib/damage-statics'
  import renderBus from '../renderBus'

  const p = () => {
    return {
      skill: 0,
      na: 0,
      ca: 0
    }
  }
  export default {
    name: 'demo',
    data () {
      return {
        onceStarted: false,
        started: false,
        proxyStatus: renderBus.proxyStatus,
        statics: [p(), p(), p(), p()]
      }
    },
    mounted () {
      const vm = this
      ipcRenderer.on('http', (e, data) => {
        if (data.type === 'attack') {
          let content = JSON.parse(data.content)
          vm.addDeltaAttack(damageStatics.parseAttackDamage(content))
        }

        if (data.type === 'skill') {
          let content = JSON.parse(data.content)
          vm.addDeltaSkill(damageStatics.parseSkillDamage(content))
        }
      })
    },
    methods: {
      clearStatics () {
        for (let e of this.statics) {
          e.ca = 0
          e.skill = 0
          e.na = 0
        }
      },
      addDeltaSkill (skillDamage) {
        console.log(skillDamage)
        for (let e of skillDamage) {
          this.statics[e.pos].skill += parseInt(e.damage)
        }
        // console.log(state.statics[0].ca)
      },
      addDeltaAttack (attackDamage) {
        console.log(attackDamage)
        for (let e of attackDamage.ca) {
          this.statics[e.pos].ca += parseInt(e.damage)
        }
        for (let e of attackDamage.na) {
          this.statics[e.pos].na += parseInt(e.damage)
        }
        // console.log(state.statics)
      },
      startProxy () {
        let vm = this
        this.started = true
        renderBus.proxyStatus = true
        this.proxyStatus = '启动中'
        let status = ipcRenderer.sendSync('start-proxy')
        if (status === 'starting') {
          vm.$message('启动中')
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
