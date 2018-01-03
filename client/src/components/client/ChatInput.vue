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
      <div v-if="this.$store.state.chat.status === 4">
        <div class="rate-container">
          <el-rate class="rate-place"
            v-model="point"
            show-text
            :texts="['1分', '2分', '3分', '4分', '5分']">
          </el-rate>
        </div>
        <span class="rate-sub" @click="sendRate()">评分完成</span>
      </div>
      <span class="chat-sub" :class="{'primary':!!msg}"  @click="send(msg)">发送</span>
      <span class="operator-sub" @click="callService()">人工客服</span>
      <span class="message-sub" @click="leaveMessage(msg)">留言</span>
      <el-upload
        action="uploadImageUrl"
        :on-success="uploadImgSuccess"
        :before-upload="beforeImgUpload"
        :show-file-list="false">
        <el-button size="small" type="primary" style="margin-left:5px">上传图片</el-button>
      </el-upload>
    </div>
  </div>
</template>

<script>
// import Chat from '../api/client'
import vueEmoji from '../tools/emoji.vue'
export default {
  data () {
    return {
      msg: '',
      showEmoji: false,
      point: 0
    }
  },
  computed: {
    uploadImageUrl () {
      return this.$store.state.chat.serverIp + '/clientimage'
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
        let newMsg = this.$store.state.chat.createMsg()
        newMsg.msg = '请勿发送空白消息'
        newMsg.type = 2
        this.$store.state.chat.msgList.push(newMsg)
        this.msg = ''
        return
      }
      this.$store.commit('sendMsg', msg)
      this.msg = ''
    },
    callService () {
      this.$store.commit('callService')
    },
    selectEmoji (code) {
      this.msg += code
      this.showEmoji = false
    },
    leaveMessage (msg) {
      for (var i = 0; i < this.msg.length; i++) {
        if (this.msg[i] !== '\n' && this.msg[i] !== ' ' && this.msg[i] !== '\t') {
          break
        }
      }
      if (i === this.msg.length) {
        let newMsg = this.$store.state.chat.createMsg()
        newMsg.msg = '请勿发送空白消息'
        newMsg.type = 2
        this.$store.state.chat.msgList.push(newMsg)
        this.msg = ''
        return
      }
      this.$store.commit('leaveMsg', msg)
      this.msg = ''
    },
    sendRate () {
      if (this.point === 0) {
        let newMsg = this.$store.state.chat.createMsg()
        newMsg.msg = '请给出一个1-5分之间的有效分数'
        newMsg.type = 2
        this.$store.state.chat.msgList.push(newMsg)
      } else {
        this.$store.commit('sendRate', this.point)
      }
    },
    uploadImgSuccess (res, file) {
      let newMsg = this.$store.state.chat.createMsg()
      newMsg.imageUrl = URL.createObjectURL(file.raw)
    }
  },
  components: {
    vueEmoji
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
ul{
  margin: 0;
  padding: 0;
  list-style: none;
}
.foot-wrapper{
  background-color: #f1f1f1;
  height: 40px;
  flex-shrink: 0;
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
  .chat-input-line{
    height: 100%;
    width: 70%;
    border-radius: 10px;
    outline: none;
    border:none; 
    box-sizing: border-box;
    padding: 5px;
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
      margin-left: 340px;
    }
    .operator-sub{
      position: relative;
      display: flex;
      background-color: rgba(0,0,0,0.1);
      justify-content: center;
      align-items: center;
      height: 30px;
      width: 78px;
      font-size: 13px;
      outline: none;
      margin-left: 5px;
    }
    .message-sub{
      position: relative;
      display: flex;
      background-color: rgba(0,0,0,0.1);
      justify-content: center;
      align-items: center;
      height: 30px;
      width: 50px;
      font-size: 13px;
      outline: none;
      margin-left: 5px;
    }
    .rate-container{
      position: absolute;
      display: flex;
      margin-left: 85px;
      margin-top: 5px;
      width: 160px;
      background-color: white;
    }
    .rate-place{
      margin-left: 5px;
    }
    .rate-sub{
      position: absolute;
      display: flex;
      background-color: rgba(0, 0, 0, 0.1);
      justify-content: center;
      align-items: center;
      height: 30px;
      width: 78px;
      font-size: 13px;
      outline: none;
      margin-left: 250px;
    }
    .operator-sub, .chat-sub, .message-sub, .rate-sub:hover{
      cursor: pointer;
    }
    .primary{
      background-color: #1E90FF;
      color: white;
    }
  }
  

}
</style>