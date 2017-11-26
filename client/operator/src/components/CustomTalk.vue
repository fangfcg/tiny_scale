<template>
<div class="CustomTalk">
    <el-row>
        <el-col :span="6">
            <el-menu class="el-menu-vertical-demo">
                <el-menu-item v-for="cus in this.$store.state.chat.userList":key="cus.id":index="cus.userid" @click="changeCard(cus.userid)" >
                    用户{{cus.userid}}
                </el-menu-item>
            </el-menu>
        </el-col>
        <!--<template v-if="this.$store.state.chat.currentNum > 0">-->
            <el-col :span="10">
                <div class="chatall">
                    <chat-component></chat-component>
                </div>
            </el-col>
        <!--</template>-->
    </el-row>
    </div>
</template>




<script>
import ChatComponent from './ChatComponent'

export default {
  name: 'CustomTalk',
  data: function () {
    return {
      currShowId: -1
    }
  },
  methods: {
    changeCard (useridNew) {
      console.log('CustomTalk')
      console.log(useridNew)
      this.$store.commit('changeCard', useridNew)
    }
  },
  components: {
    ChatComponent
  }
}
</script>

<style>
.chatall{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 600px;
  height: 600px;
}
</style>