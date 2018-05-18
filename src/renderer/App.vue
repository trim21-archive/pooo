<template>
  <div id="app">
    <el-row>
      <el-menu class="el-menu-demo" mode="horizontal" :router="true" v-if="!$store.state.Proxy.running">
        <el-menu-item index="/">home</el-menu-item>
        <el-menu-item v-if="!$store.state.Proxy.running" index="/config">config</el-menu-item>
        <el-menu-item index="/demo">demo</el-menu-item>
        <el-menu-item index="/dmg">伤害统计</el-menu-item>
      </el-menu>
    </el-row>
    <el-row>
      <!-- <keep-alive> -->
        <router-view></router-view>
      <!-- </keep-alive> -->
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'pooo'
}
</script>

<style>
/* CSS */
</style>
