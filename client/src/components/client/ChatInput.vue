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
      <div class = "score-bar" v-show="this.$store.state.chat.status === 4">
        <div class="rate-container">
          <el-rate class="rate-place"
            v-model="point"
            show-text
            :texts="['1分', '2分', '3分', '4分', '5分']">
          </el-rate>
        </div>
        <el-button class="rate-sub" size="small" @click="sendRate()">评分完成</el-button>
      </div>
      <el-button size="small" class="chat-sub" :class="{'primary':!!msg}"  @click="send(msg)" v-show="this.$store.state.chat.status !== 4">发送</el-button>
      <el-button size="small" class="operator-sub" @click="callService()" v-show="this.$store.state.chat.status !== 4">人工客服</el-button>
      <el-button size="small" class="message-sub" @click="leaveMessage(msg)" v-show="this.$store.state.chat.status !== 4">留言</el-button>
      <el-button size="small" class="message-sub" @click="cutImage()" v-show="this.$store.state.chat.status !== 4">截图</el-button>

      <el-upload
        :action="uploadImageUrl"
        :on-success="uploadImgSuccess"
        :before-upload="beforeImgUpload"
        :show-file-list="false"
        :with-credentials="true">
        <el-button size="small" class="upload-sub" style="margin-left:5px" v-show="this.$store.state.chat.status !== 4" >上传图片</el-button>
      </el-upload>
    </div>
  </div>
</template>

<script>
// import Chat from '../api/client'
import vueEmoji from '../tools/emoji.vue'
import html2canvas from 'html2canvas'

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
      return this.$store.state.chat.serverIp + '/api/upload_chat_file'
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
      this.$store.commit('sendMsg', {msg: msg, isPic: false})
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
        newMsg.msg = '请勿发送空白留言'
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
      newMsg.isPicture = true
      newMsg.msg = this.$store.state.chat.serverIp + '/' + res.path // to be done
      this.$store.commit('sendMsg', {msg: newMsg.msg, isPic: true})
      this.$message({
        message: '图片上传成功',
        type: 'success'
      })
    },
    beforeImgUpload (file) {
      const isJPG = (file.type === 'image/jpeg')
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    async cutImage () {
      var canvas = await html2canvas(document.querySelector('body'), {
        allowTaint: true,
        taintTest: false
      })
      var image = canvas.toDataURL('image/jpeg', 1)
      var parts = image.split(';base64,')
      var contentType = parts[0].split(':')[1]
      var raw = window.atob(parts[1])
      var uInt8Array = new Uint8Array(raw.length)
      for (var i = 0; i < raw.length; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      var blob = new Blob([uInt8Array], {type: contentType})
      var eleLink = document.createElement('a')
      eleLink.download = 'pic.jpeg'
      eleLink.style.display = 'none'
      eleLink.href = URL.createObjectURL(blob)
      document.body.appendChild(eleLink)
      eleLink.click()
      document.body.removeChild(eleLink)
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
  height: 40px;
  flex-shrink: 0;
  padding: 5px 10px;
  justify-content: space-between;
  border-top: solid 1px rgba(0,0,0,0.1);
  textarea {
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
      /*
      position: relative;
      display: flex;
      background-color: rgba(0,0,0,0.1);
      justify-content: center;
      align-items: center;
      height: 30px;
      width: 50px;
      font-size: 13px;
      outline: none;
      */
      height: 30px;
      margin-left: 200px;
    }
    .operator-sub{/*
      position: relative;
      display: flex;
      background-color: rgba(0,0,0,0.1);
      justify-content: center;
      align-items: center;
      height: 30px;
      width: 78px;
      font-size: 13px;
      outline: none;
      */
      height: 30px;
      margin-left: 5px;
    }
    .message-sub{
      /*
      position: relative;
      display: flex;
      background-color: rgba(0,0,0,0.1);
      justify-content: center;
      align-items: center;
      height: 30px;
      width: 50px;
      font-size: 13px;
      outline: none;
      */
      height: 30px;
      margin-left: 5px;
    }
    .rate-container{
      position: absolute;
      display: flex;
      margin-left: 100px;
      margin-top: 5px;
      width: 160px;
      background-color: white;
    }
    .rate-place{
      margin-left: 5px;
    }
    .rate-sub{
      /*
      position: absolute;
      display: flex;
      background-color: rgba(0, 0, 0, 0.1);
      justify-content: center;
      align-items: center;
      height: 30px;
      width: 78px;
      font-size: 13px;
      outline: none;
      */
      height: 30px;
      margin-left: 250px;
    }
    .upload-sub{
      margin-left: 5px;
      height: 30px;
    }
    .operator-sub, .chat-sub, .message-sub, .rate-sub:hover{
      cursor: pointer;
    }
    .primary{
      background-color: #1E90FF;
      color: white;
    }
    .score-bar {
      position: relative;
      float: left;
    }
  }
  

}
</style>