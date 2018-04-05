<template>
  <div id="demo">
    <div v-if="!$store.state.Proxy.running">
      <span class="title"> Welcome! </span>
      <el-button @click="startProxy">开启代理</el-button>
    </div>
    <div v-else>
      proxy running
      <p>在开启代理服务器后无法切换到伤害统计</p>
      <p>暂时不会区分同一站位的不同角色,不同战斗同一位置造成的伤害会累积</p>
      <el-button icon="el-icon-document" size="small" @click="clearStatics">清空</el-button>
      <el-table :data="statics" border style="width: 100%">
        <el-table-column prop="skill" label="技能伤害" width="90"> </el-table-column>
        <el-table-column prop="na" label="平砍" width="90"> </el-table-column>
        <el-table-column prop="ca" label="奥义" width="90"> </el-table-column>
        <el-table-column label="总计伤害" width="90">
          <template slot-scope="scope">
            {{ scope.row.skill+scope.row.ca+scope.row.na }}
          </template>
        </el-table-column>
        <el-table-column label="平均每T上海伤害" width="90">
          <template slot-scope="scope">
            {{format( (scope.row.skill+scope.row.ca+scope.row.na)/t )}}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import { ipcRenderer, shell } from 'electron'
  import damageStatics from '../../lib/damage-statics'

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
        started: this.$store.state.Proxy.running,
        statics: [p(), p(), p(), p()],
        t: 0
      }
    },
    mounted () {
      const vm = this
      ipcRenderer.on('http', (e, data) => {
        try {
          if (data.type === 'attack') {
            vm.t += 1
            let content = JSON.parse(data.content)
            vm.addDeltaAttack(damageStatics.parseAttackDamage(content))
          }
        } catch (error) {
          console.log(error)
          console.log(data)
        }
        if (data.type === 'skill') {
          let content = JSON.parse(data.content)
          vm.addDeltaSkill(damageStatics.parseSkillDamage(content))
        }
      })
    },
    methods: {
      format (num) {
        return Math.round(num)
      },
      clearStatics () {
        this.t = 0
        for (let e of this.statics) {
          e.ca = 0
          e.skill = 0
          e.na = 0
        }
      },
      addDeltaSkill (skillDamage) {
        for (let e of skillDamage) {
          this.statics[e.pos].skill += parseInt(e.damage)
        }
        // console.log(state.statics[0].ca)
      },
      addDeltaAttack (attackDamage) {
        for (let e of attackDamage.ca) {
          this.statics[e.pos].ca += parseInt(e.damage)
        }
        for (let e of attackDamage.na) {
          this.statics[e.pos].na += parseInt(e.damage)
        }
        // console.log(state.statics)
      },
      startProxy () {
        this.$store.dispatch('startAnyProxy')
      },
      open: shell.openExternal
    }
  }
</script>

<style>

</style>
