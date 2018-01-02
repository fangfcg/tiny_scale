<template>
<div class="CustomTalk">
  <el-container>
  <el-aside width="200px">
    <el-menu class="el-menu-vertical-demo">
      <el-menu-item v-for="cus in this.$store.state.chat.userList" :key="cus.id" :index="cus.userid.toString()" @click="changeCard(cus.userid)" >
        用户{{cus.userid}}
      </el-menu-item>
    </el-menu>
  </el-aside>
  <el-main>
    <template>
      <div class="chatall">
        <chat-component></chat-component>
      </div>
      <div class="chatadd">
        <chat-common></chat-common>
      </div>
    </template>
  </el-main>
  </el-container>
  </div>
</template>




<script>
import ChatComponent from './ChatComponent'
import ChatCommon from './ChatCommon'

export default {
  name: 'CustomTalk',
  data: function () {
    return {
      currShowId: -1
    }
  },
  methods: {
    changeCard (useridNew) {
      this.$store.commit('changeCard', useridNew)
    }
  },
  components: {
    ChatComponent,
    ChatCommon
  }
}
</script>

<style>
.chatall{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 600px;
  height: 800px;
  float: left;
}
.chatadd{
  float: left;
  width: 240px;
  height: 600px;
  margin-left: 20px;
}
</style>