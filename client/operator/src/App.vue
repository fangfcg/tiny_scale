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

import ChatComponent from './components/ChatComponent'

export default {
  components: {
    ChatComponent
  }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
html {
  height: 100%;
}

body {
  height: 100%;
}
.chatall{
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  width: 600px;
}

</style>
