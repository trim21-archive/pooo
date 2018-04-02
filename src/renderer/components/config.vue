<template>
    <div id="config">
        <el-form ref="form" :model="configForm" label-width="120px" size="mini">
            <el-form-item label="代理端口">
                <el-input-number v-model="configForm.port" :min="0" :max="65535"></el-input-number>
            </el-form-item>
            <el-form-item label="游戏域名">
                <el-select v-model="configForm.apiHostNames" multiple filterable allow-create default-first-option placeholder="请输入域名">
                    <el-option v-for="item in optionsApi" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="解析HTTPS">
                <el-switch v-model="configForm.forceProxyHttps" active-text="开" inactive-text="关">
                </el-switch>
            </el-form-item>
            <el-form-item label="DEBUG mode">
                <el-switch v-model="configForm.DEBUG" active-text="开" inactive-text="关">
                </el-switch>
            </el-form-item>
            <el-form-item label="监控页端口">
                <el-input-number v-model="configForm.webPort" :disabled='true' :min="0" :max="65535"></el-input-number>
            </el-form-item>
            <el-form-item label="前置代理">
                <el-switch v-model="configForm.frontAgent" active-text="开" inactive-text="关">
                </el-switch>
            </el-form-item>
            <el-form-item label="前置代理端口">
                <el-input-number :min="0" :max="65535" :disabled="!configForm.frontAgent" v-model="configForm.frontAgentPort"></el-input-number>
            </el-form-item>
            <el-form-item size="normal">
                <el-button type="primary" :loading="false" @click="onSubmit">保存配置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
  import { ipcRenderer, remote } from 'electron'
  import fs from 'fs'
  import path from 'path'
  const configPath = path.resolve(remote.app.getPath('userData'), 'config.json')
  let config = {}
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  } else {
    config = {
      'apiHostNames': [
        'game.granbluefantasy.jp',
        'gbf.game.mbga.jp'
      ],
      'port': 8001,
      'webInterface': true,
      'webPort': 8002,
      'forceProxyHttps': false,
      'wsIntercept': true,
      'frontAgent': false,
      'frontAgentHost': '127.0.0.1',
      'frontAgentPort': 8123,
      'DEBUG': Boolean(process.env.debug)
    }
    fs.writeFile(JSON.stringify(config, null, 2), err => {
      console.log(err)
    })
  }

  export default {
    name: 'landing-page',
    data () {
      return {
        configForm: config,
        bthLoading: false,
        optionsApi: [
          {label: 'game.granbluefantasy.jp', value: 'game.granbluefantasy.jp'},
          {label: 'gbf.game.mbga.jp', value: 'gbf.game.mbga.jp'}
        ]
      }
    },
    methods: {
      onSubmit () {
        this.bthLoading = true
        if (this.configForm.port === this.configForm.webPort) {
          this.configForm.webPort = this.configForm.port + 1
        }
        // saveConfig(this.configForm)
        ipcRenderer.send('update-config', this.configForm)
        fs.writeFile(configPath, JSON.stringify(this.configForm, null, 2), err => {
          if (err) {
            this.$message('error saving config to local')
            remote.app.log.error(err)
          }
        })
        this.$router.push('/demo')
      }
    }
  }
</script>

<style>

</style>
