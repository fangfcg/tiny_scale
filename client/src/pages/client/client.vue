<template>
  <div class = "container">
    <div class="chatall" v-show="showFlag">
      <chat-component></chat-component>
    </div>
    <div><el-button 
              class="serve-button" 
              type="text" 
              @click="showFlag=!showFlag"
              icon="el-icon-service">
            </el-button>
    </div>
  </div>
  <!-- <group-info></group-info> -->
</template>

<script>

import ChatComponent from '@/components/client/ChatComponent'

export default {
  data () {
    return {
      showFlag: false
    }
  },
  components: {
    ChatComponent
  },
  methods: {
  }
}
</script>

<style>
/*
*{
  margin: 0;
  padding: 0;
}*/
html {
  height: 100%;
}

body {
  height: 100%;
}
.container {
  
}
.chatall{
  position: relative;
}
.serve-button {
  position: fixed;
  z-index: 20;
  right: 50px;
  bottom: 50px;
  font-size: 50px;
}

</style>
