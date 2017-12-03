<template>
  <div class="foot-wrapper">
    <textarea placeholder="按 Enter 发送" name="" @keyup.enter="send(msg)" v-model="msg"></textarea>
    <div class="button-area">
      <span class="chat-sub" :class="{'primary':!!msg}"  @click="send(msg)">发送</span>
      <span class="operator-sub" @click="finishService()">结束服务</span>
    </div>
  </div>
</template>

<script>
// import Chat from '../api/client'
export default {
  data () {
    return {
      msg: ''
    }
  },
  ready () {
  },
  methods: {
    send (msg) {
      for (var i = 0; i < this.msg.length; i++) {
        if (this.msg[i] !== '\n' && this.msg[i] !== ' ' && this.msg[i] !== '\t') {
          break
        }
      }
      if (i === this.msg.length) {
        var newMsg = this.$store.state.chat.createMsg()
        newMsg.msg = '请勿发送空白消息'
        newMsg.type = 2
        this.$store.state.chat.userList[this.$store.state.chat.currentIndex].msgList.push(newMsg)
        this.msg = ''
        return
      }
      this.$store.commit('sendMsg', msg)
      this.msg = ''
    },
    finishService () {
      this.$store.commit('endService')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
.foot-wrapper{
  background-color: #f1f1f1;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  padding: 5px 10px;
  justify-content: space-between;
  border-top: solid 1px rgba(0,0,0,0.1);
  textarea {
    background-color: #eee;
    padding: 10px;
    height: 70px;
    width: 98%;
    border: none;
    outline: none;
    font-family: "Micrsofot Yahei";
    resize: none;
  }
  .button-area{
    display: flex;
    .chat-sub{
      position: relative;
      display: flex;
      background-color: rgba(0,0,0,0.1);
      justify-content: center;
      align-items: center;
      height: 30px;
      width: 50px;
      font-size: 13px;
      outline: none;
      margin-left: 440px;
    }
    .operator-sub{
      position: relative;
      display: flex;
      background-color: rgba(0,0,0,0.1);
      justify-content: center;
      align-items: center;
      height: 30px;
      width: 80px;
      font-size: 13px;
      outline: none;
      margin-left: 5px;
    }
    .operator-sub, .chat-sub:hover{
      cursor: pointer;
    }
    .primary{
      background-color: #1E90FF;
      color: white;
    }
  }
}
</style>