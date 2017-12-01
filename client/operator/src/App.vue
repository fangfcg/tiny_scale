<template>
    <div id="app">
    <header>
      <el-row>
        <el-col :span="24">
          <el-menu class="el-menu-demo":router=true mode="horizontal">
            <el-menu-item index="/CustomMenu">客服界面</el-menu-item>
            <el-menu-item index="/CustomTalk">会话界面</el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </header>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  created () {
    this.$store.commit('initSock')
    // console.log(11112)
    // console.log(this.chatobj.userName)
    // console.log(Chat.msgList[0])
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
