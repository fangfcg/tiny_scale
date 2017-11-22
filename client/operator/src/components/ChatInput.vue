<template>
  <div class="foot-wrapper">
    <input class="chat-input-line" type="text" name="" @keyup.enter="send(msg)" v-model="msg">
    <span class="chat-sub" :class="{'primary':!!msg}"  @click="send(msg)">发送</span>
    <span class="operator-sub" @click="finishService()">结束服务</span>
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
      if (msg === '') {
        return
      }
      this.$store.commit('sendMsg', msg)
      // this.$emit('sendMsg', msg)
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
  padding: 5px 10px;
  justify-content: space-between;
  border-top: solid 1px rgba(0,0,0,0.1);
  .chat-input-line{
    height: 100%;
    width: 70%;
    border-radius: 10px;
    outline: none;
    border:none; 
    box-sizing: border-box;
    padding: 5px;
  }
  .chat-sub{
    display: flex;
    background-color: rgba(0,0,0,0.1);
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 12%;
    border-radius: 10px;
    outline: none;
  }
  .operator-sub{
    display: flex;
    background-color: rgba(0,0,0,0.1);
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 14%;
    margin-right: 10px;
    border-radius: 10px;
    outline: none;
  }
  .operator-sub, .chat-sub:hover{
    cursor: pointer;
  }
  .primary{
    background-color: #1E90FF;
    color: white;
  }
}
</style>