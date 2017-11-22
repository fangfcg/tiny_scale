<template>
  <div class="chatbox">
    <chat-body></chat-body>
    <chat-input></chat-input>
  </div>
  <!-- <group-info></group-info> -->
</template>

<script>

import ChatBody from './ChatBody'
import ChatInput from './ChatInput'

export default {
  data () {
    return {
    }
  },
  components: {
    ChatBody,
    ChatInput
  },
  methods: {
  },
  created () {
    this.$store.commit('initSock')
    // console.log(11112)
    // console.log(this.chatobj.userName)
    // console.log(Chat.msgList[0])
  }
}
</script>

<style lang='less'>
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
.chatbox{
  width: 100%;
  //display: flex;
  //flex-direction: column;
  height: 100%;
  justify-content: space-between;
}

chat-input {
  float: top;

}
</style>

