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
      <span class="operator-sub" @click="finishService()">结束</span>
      <span class="transfer-sub" @click="transferCommand">转接</span>
      <el-upload
        action="uploadImageUrl"
        :on-success="uploadImgSuccess"
        :before-upload="beforeImgUpload"
        :show-file-list="false">
        <el-button size="small" type="primary" style="margin-left:5px">上传图片</el-button>
      </el-upload>
      <el-dialog title="收货地址" :visible.sync="dialogTableVisible">
        <el-table :data="gridData">
          <el-table-column property="id" label="客服ID"></el-table-column>
          <el-table-column property="name" label="客服昵称"></el-table-column>
          <el-table-column property="status" label="客服状态"></el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="transferClient(scope.row.id)" type="text" size="small" :disabled="scope.row.status === 'resting'">转接</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import vueEmoji from '../tools/emoji.vue'
export default {
  data () {
    return {
      msg: '',
      showEmoji: false,
      dialogTableVisible: false,
      gridData: []
    }
  },
  computed: {
    serverIp () {
      return this.$store.state.chat.serverIp
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
    },
    transferCommand () {
      this.$http.get(this.serverIp + '/api/operator/get_colleagues').then(function (response) {
        this.gridData = response
      })
      this.dialogTableVisible = true
    },
    transferClient (operatorId) {
      this.$store.commit('crossServe', operatorId)
      this.dialogTableVisible = false
    },
    uploadImgSuccess (res, file) {
      let newMsg = this.$store.state.chat.createMsg()
      newMsg.isPicture = true
      newMsg.msg = this.$store.state.chat.serverIp + res
      this.$store.state.chat.userList[this.$store.state.chat.currentIndex].msgList.push(newMsg)
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
      margin-left: 340px;
    }
    .operator-sub{
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
    .transfer-sub{
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
    .operator-sub, .chat-sub, .transfer-sub:hover{
      cursor: pointer;
    }
    .primary{
      background-color: #1E90FF;
      color: white;
    }
  }
}
</style>