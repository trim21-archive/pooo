<template>
  <div id="demo">
    <div v-if="!$store.state.Proxy.running">
      <span class="title"> Welcome! </span>
      <el-button @click="startProxy">开启代理</el-button>
    </div>
    <div v-else>
      proxy running
      <el-button @click="startRecord" v-if="!recording">开始战斗录制</el-button>
      <el-button @click="stopRecord" v-else>停止战斗录制</el-button>
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
        <el-table-column label="平均每T攻击伤害" width="90">
          <template slot-scope="scope">
            {{ format((scope.row.ca + scope.row.na)/t) }}
          </template>
        </el-table-column>
        <el-table-column label="平均每T伤害" width="90">
          <template slot-scope="scope">
            {{ format((scope.row.skill + scope.row.ca + scope.row.na)/t) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import { ipcRenderer, shell, remote } from 'electron'
  import damageStatics from '../../lib/damage-statics'
  import renderBus from '../renderBus'
  import fs from 'fs'
  import path from 'path'
  var zlib = require('zlib')
var exec = require('child_process').exec
const p = () => {
    return {
      skill: 0,
      na: 0,
      ca: 0
    }
  }
  export default {
    name: 'dmg',
    data () {
      return {
        recording: false,
        record: [],
        lastRecord: [],
        onceStarted: false,
        started: this.$store.state.Proxy.running,
        statics: [p(), p(), p(), p()],
        t: 0
      }
    },
    mounted () {
      const vm = this

      renderBus.$on('boss-update', (message) => {
        vm.record.push({ws: message})
        console.log(vm.record)
      })

      ipcRenderer.on('http', (e, data) => {
        if (vm.recording) {
          if (data.type === 'attack' || data.type === 'skill' || data.type === 'summon' || data.type === 'join-battle') {
            let type = data.type
            let obj = {}
            obj[type] = JSON.parse(data.content)
            vm.record.push(obj)
            console.log(vm.record)
          }
        }
  
        try {
          if (data.type === 'attack') {
            vm.t += 1
            let content = JSON.parse(data.content)
            vm.addDeltaAttack(damageStatics.parseAttackDamage(content))
            console.log(damageStatics.parseAttackDamage(content))
          }
        } catch (error) {
          console.log(error)
          console.log(data)
        }
        if (data.type === 'skill') {
          let content = JSON.parse(data.content)
          vm.addDeltaAttack(damageStatics.parseAttackDamage(content))
          // vm.addDeltaSkill(damageStatics.parseSkillDamage(content))
        }
      })
    },
    methods: {
      startRecord () {
        this.recording = true
        this.record = []
      },
      stopRecord () {
        let vm = this
        let rec = JSON.stringify(this.record)
        let t = new Date()
        let filename = `${t.getFullYear()}-${t.getMonth() + 1}-${t.getDate()} ${t.getHours()}.${t.getMinutes()}.${t.getSeconds()}.json.gz`
        let filepath = path.resolve(remote.app.getPath('userData'), 'record', filename)
        // let fd = fs.openSync(filepath, 'w+')
        // fd.writeFileSync
        zlib.gzip(rec, (err, res) => {
          if (err) {
            vm.$message.error(err)
          } else {
            fs.writeFile(filepath, res, { flag: 'w+' }, (err) => {
              if (err) {
                vm.$message.error(err)
              } else {
                vm.record = []
                vm.recording = false
                this.$confirm('记录已保存为' + filename, '提示', {
                  confirmButtonText: '打开文件夹',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  exec(`Explorer /select,${filepath}`)
                // shell.openExternal()
                }).catch(() => {
                })
              }
            })
          }
        })
      },
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
        renderBus.$emit('start-wsc')
      },
      open: shell.openExternal
    },
    beforeDestroy () {
      renderBus.$off('boss-update')
    }
  }
</script>

<style>

</style>
