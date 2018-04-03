<template>
  <div id="wrapper">
    <span class="title">
      Welcome!!
      <!-- <el-button @click='checkUpdate()'>check for update</el-button> -->
    </span>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron'
import marked from 'marked'
export default {
  name: 'landing-page',
  mounted () {
    ipcRenderer.on('update-available', (e, release) => {
      this.$confirm(marked(release.body), `发现更新${release.name}`, {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '下载',
        cancelButtonText: '取消'
        // type: 'info'
      }).then(() => {
        console.log(release)
        this.$electron.shell.openExternal(release.html_url)
      }).catch(() => {})
    })

    ipcRenderer.on('update-not-available', (e, data) => {
      this.$message('没有更新')
    })
    this.checkUpdate()
  },
  methods: {
    checkUpdate () {
      ipcRenderer.send('check-update')
      console.log('check upate')
    }
  }
}
</script>

<style>

</style>
