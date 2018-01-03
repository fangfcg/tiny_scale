<template>
  <div class="chatbox" :style="bodystyle">
    <div class="chattop" @mousedown="drag($event)"></div>
    <chat-body class="chatbody"></chat-body>
    <chat-input class="chatinput"></chat-input>
  </div>
  <!-- <group-info></group-info> -->
</template>

<script>

import ChatBody from './ChatBody'
import ChatInput from './ChatInput'

export default {
  data () {
    return {
      bodystyle: {
        left: '300px',
        top: '150px'
      }
    }
  },
  components: {
    ChatBody,
    ChatInput
  },
  created () {
    // this.$store.commit('initSock')
  },
  methods: {
    drag (event) {
      var self = this
      // var oDiv = event.currentTarget
      // var oWindow = oDiv.parentNode
      let disX = event.clientX - parseInt(self.bodystyle.left)
      let disY = event.clientY - parseInt(self.bodystyle.top)
      document.onmousemove = function (e) {
        let l = e.clientX - disX
        let t = e.clientY - disY
        console.log(e.clientX, e.clientY)
        self.bodystyle.left = l + 'px'
        self.bodystyle.top = t + 'px'
      }
      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
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

.chattop{
  height: 50px;
  background-color: #2e3238;
}

.chatbox{
  position: absolute;
  width: 600px;
  height: 600px;
  justify-content: space-between;
  border:1px;
  border-color: #2e3238;
  border-radius:5px;
  box-shadow: 0 0 3px #888888;
  .chatbody{
    height: 400px;
  }
  .chatinput{
    height: 120px;
    float: top;
  }
}


</style>
