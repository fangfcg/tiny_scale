<template>
  <div class="foot-wrapper">
    <textarea placeholder="按 Enter 发送" name="" @keyup.enter="send(msg)" v-model="msg"></textarea>
    <div class="button-area">
      <el-button 
        class="pop-close" 
        type="text" 
        @click="showEmoji = !showEmoji"
        icon="el-icon-circle-plus-outline">
      </el-button>
      <div class="icon clearfix">
        <transition name="fade" mode="">
          <div class="emoji-box" v-if="showEmoji" >
            <el-button 
              class="pop-close" 
              type="text" 
              @click="showEmoji = false"
              icon="el-icon-close">
            </el-button>
            <vue-emoji class="vue-emoji-class"
              @select="selectEmoji">
            </vue-emoji>
            <span class="pop-arrow arrow"></span>
          </div>
        </transition>
      </div>
      <span class="chat-sub" :class="{'primary':!!msg}"  @click="send(msg)">发送</span>
      <span class="operator-sub" @click="finishService()">结束服务</span>
    </div>
  </div>
</template>

<script>
import vueEmoji from '../tools/emoji.vue'
export default {
  data () {
    return {
      msg: '',
      showEmoji: false
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
    },
    selectEmoji (code) {
      this.msg += code
      this.showEmoji = false
    }
  },
  components: {
    vueEmoji
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
    .icon {
      position: relative;
      margin-top: 20px;
    }
    .emoji-box {
      position: absolute;
      z-index: 10;
      left: -35px;
      top: 24px;
      box-shadow: 0 4px 20px 1px rgba(0, 0, 0, 0.2);
      background: white;
      .el-button {
        position: absolute;
        border: none;
        color: #FF4949;
        right: 12px;
        top: 12px;
        z-index: 10;
      }
      .arrow {
        left: 10px;
      }
    }
    .clearfix {
      &:after {
        content: '';
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
      }
    }

    .vue-emoji-class {
      margin-right: 10px;
      margin-top: 10px;
    }

    .fade-enter-active, .fade-leave-active { transition: opacity .5s; }
    .fade-enter, .fade-leave-active { opacity: 0; }
    .fade-move { transition: transform .4s; }

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