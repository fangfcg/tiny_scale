<template>
<div class="CustomTalk">
    <el-row>
        <el-col :span="6">
            <el-menu class="el-menu-vertical-demo">
                <el-menu-item v-for="cus in this.$store.state.customerArray":key="cus.id":index="cus.id" >
                    用户{{cus.id}}
                </el-menu-item>
            </el-menu>
        </el-col>
    
        <el-col :span="10">
            <div class="chatall">
                <chat-component></chat-component>
            </div>
        </el-col>
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
  height: 800px;
  justify-content: space-between;
  width: 600px;
}
</style>