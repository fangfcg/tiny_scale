<template>
  <div class="main-contain">
    <span class="title-text">设置</span>
    <hr width=80% size=1 color=#c5c5c5 style="FILTER: alpha(opacity=100,finishopacity=0,style=3)"> 
    <span class="main-text">头像设置</span>
      <el-upload
        class="avatar-uploader"
        :action="uploadImageUrl"
        :show-file-list="false"
        :on-preview="handlePictureCardPreview"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    <hr width=70% size=1 color=#c5c5c5 style="FILTER: alpha(opacity=100,finishopacity=0,style=3)"> 
    <span class="main-text">昵称设置</span><br>
    <el-input
      class="name-input"
      placeholder="请输入昵称"
      :disabled="nameInputFlag"
      v-model="inputName">
    </el-input>
    <el-button @click="nameModify">修改</el-button>
    <el-button :disabled="nameButtonFlag" @click="nameSubmit" :loading="nameLoading">提交</el-button>
    <hr width=70% size=1 color=#c5c5c5 style="FILTER: alpha(opacity=100,finishopacity=0,style=3)"> 
    <span class="main-text">邮箱设置</span><br>
    <el-input
      class="email-input"
      placeholder="请输入邮箱"
      :disabled="emailInputFlag"
      v-model="inputEmail">
    </el-input>
    <el-button @click="emailModify">修改</el-button>
    <el-button :disabled="emailButtonFlag" @click="emailSubmit" :loading="emailLoading">提交</el-button>
    <hr width=70% size=1 color=#c5c5c5 style="FILTER: alpha(opacity=100,finishopacity=0,style=3)"> 
    <span class="main-text">自定义快捷回复设置 <el-button style="margin-left:100px" @click="openSelfDialog()">设置</el-button></span><br>
    <el-dialog
        title="快捷回复设置"
        :visible.sync="selfDialogVisible"
        width="70%"
        :before-close="selfHandleClose">
        <div style="text-align: center"> <el-button class="small-elbutton" @click="openAddDialog(selfData.length)">新建回复</el-button> </div>

            <el-dialog
            title=""
            :visible.sync="addDialogVisible"
            width="50%"
            :before-close="addHandleClose"
            append-to-body>
              <span class="small-title">{{addTitle}}</span>
              <textarea class="big-textarea" v-model="rawText" placeholder="" maxlength="150"> </textarea>

              <span slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="addDialogClose()">确 定</el-button>
              </span>
            </el-dialog>

        <el-table
          :data="selfData"
          style="width: 100%">
          <el-table-column
            label="序号"
            min-width="20">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="自定义信息">    
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.text }}</span>
            </template>                
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="80">
            <template slot-scope="scope">
              <el-button class="small-elbutton" @click="openAddDialog(scope.$index)">修改</el-button>
                <el-button class="small-elbutton" type="danger" @click="delReply(scope.$index)">删除</el-button>
                <el-button class="small-elbutton" v-if="scope.$index != 0" @click="upReply(scope.$index)">上移</el-button>
                <el-button class="small-elbutton" v-if="scope.$index != selfData.length-1" @click="downReply(scope.$index)">下移</el-button>
              
            </template>
          </el-table-column>
        </el-table>

        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="selfDialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>

   

    <hr width=70% size=1 color=#c5c5c5 style="FILTER: alpha(opacity=100,finishopacity=0,style=3)"> 
    <span class="main-text">公司预设快捷回复查看 <el-button style="margin-left:90px" @click="openComDialog()">查看</el-button></span><br>
     <el-dialog
        title="快捷回复查看"
        :visible.sync="comDialogVisible"
        width="40%"
        :before-close="comHandleClose">
        <span class="small-title">快捷回复列表如下</span>
        <div v-for="(sentence, index) in compData" :key=index>
            <span>{{index+1}}、{{sentence.text}}</span>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="comDialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
var setting = {
  data () {
    return {
      imageUrl: '',
      inputName: this.$store.state.chat.name,
      inputEmail: this.$store.state.chat.email,
      nameInputFlag: true,
      emailInputFlag: true,
      nameButtonFlag: true,
      emailButtonFlag: true,
      nameLoading: false,
      emailLoading: false,
      selfDialogVisible: false,
      comDialogVisible: false,
      addDialogVisible: false,
      replyID: -1,
      rawText: '',
      addTitle: ''
    }
  },
  computed: {
    uploadImageUrl () {
      return this.$store.state.chat.serverIp + '/files'
    },
    serverIp () {
      return this.$store.state.chat.serverIp
    },
    selfData () {
      return this.$store.state.chat.selfData
    },
    compData () {
      return this.$store.state.chat.compData
    }
  },
  methods: {
    handleAvatarSuccess (res, file) {
      console.log('success')
      console.log(file)
      this.imageUrl = this.$store.state.chat.serverIp + res
    },
    beforeAvatarUpload (file) {
      const isJPG = (file.type === 'image/jpeg')
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handlePictureCardPreview (file) {
      console.log(file.response)
    },
    nameModify () {
      if (this.nameButtonFlag === false) {
        this.inputName = this.$store.state.chat.name
      }
      this.nameButtonFlag = !this.nameButtonFlag
      this.nameInputFlag = !this.nameInputFlag
    },
    nameSubmit () {
      if (this.inputName === '') {
        this.$message({
          message: '昵称不能为空',
          type: 'fail'
        })
        return
      }
      this.nameLoading = true
      this.$http.post(this.serverIp + '/api/common/settings/profile', {
        type: 'operator',
        name: this.inputName
      }).then(function (response) {
        if (response.success === true) {
          setting.nameLoading = false
          setting.nameButtonFlag = true
          setting.nameInputFlag = true
        } else {
          setting.nameLoading = false
        }
      })
      if (this.nameButtonFlag === true) {
        this.$store.state.chat.name = this.inputName
        this.$message({
          message: '昵称修改成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '昵称修改失败，请重试',
          type: 'fail'
        })
      }
    },
    emailModify () {
      if (this.emailButtonFlag === false) {
        this.inputEmail = this.$store.state.chat.email
      }
      this.emailButtonFlag = !this.emailButtonFlag
      this.emailInputFlag = !this.emailInputFlag
    },
    emailSubmit () {
      console.log(this.inputEmail)
      if (this.inputEmail === '') {
        this.$message({
          message: '邮箱不能为空',
          type: 'fail'
        })
        return
      }
      this.emailLoading = true
      this.$http.post(this.serverIp + '/api/common/settings/profile', {
        type: 'operator',
        email: this.inputEmail
      }).then(function (response) {
        if (response.success === true) {
          setting.emailLoading = false
          setting.emailButtonFlag = true
          setting.emailInputFlag = true
        } else {
          setting.emailLoading = false
        }
      })
      if (this.emailButtonFlag === true) {
        this.$store.state.chat.email = this.inputEmail
        this.$message({
          message: '邮箱修改成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '邮箱修改失败，请重试',
          type: 'fail'
        })
      }
    },
    selfHandleClose () {
      this.selfDialogVisible = false
    },
    comHandleClose () {
      this.comDialogVisible = false
    },
    addHandleClose () {
      this.addDialogVisible = false
    },
    delReply (id) {
      this.$store.state.chat.selfData.splice(id, 1)
    },
    upReply (id) {
      let strFormerUp = this.$store.state.chat.selfData[id - 1].text
      let strNewUp = this.$store.state.chat.selfData[id].text
      this.$store.state.chat.selfData[id].text = strFormerUp
      this.$store.state.chat.selfData[id - 1].text = strNewUp
    },
    downReply (id) {
      let strFormerDown = this.$store.state.chat.selfData[id + 1].text
      let strNewDown = this.$store.state.chat.selfData[id].text
      this.$store.state.chat.selfData[id].text = strFormerDown
      this.$store.state.chat.selfData[id + 1].text = strNewDown
    },
    updateReply (id, newMsg) {
      this.$store.state.chat.selfData[id].text = newMsg
    },
    addDialogClose () {
      this.addDialogVisible = false
      if (this.replyID === this.$store.state.chat.selfData.length) {
        this.$store.state.chat.selfData.push({text: this.rawText})
      } else {
        this.$store.state.chat.selfData[this.replyID].text = this.rawText
      }
    },
    openAddDialog (id) {
      this.replyID = id
      this.addDialogVisible = true
      if (id === this.$store.state.chat.selfData.length) {
        this.rawText = ''
        this.addTitle = '新建回复（最大长度为150字）'
      } else {
        this.rawText = this.$store.state.chat.selfData[id].text
        this.addTitle = '修改第' + (id + 1) + '号回复（最大长度为150字）'
      }
    },
    openComDialog () {
      this.$store.commit('getCompReply')
      this.comDialogVisible = true
    },
    openSelfDialog () {
      this.$store.commit('getSelfReply')
      this.selfDialogVisible = true
    }
  }
}
export default setting
</script>

<style lang='less'>
  .main-contain {
    padding:0% 15% 0 15%;
  }
  .title-text {
    font-size:25px;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .main-text {
    font-size:20px;
    margin-top:20px;
  }
  .avatar-uploader .el-upload {
    margin-top:20px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .name-input, .email-input {
    width:200px;
    margin-top:20px;
    margin-right:40px;
  }
  .small-title {
    font-size:20px;
    color:#ff0000;
    display: block;
    text-align: center;
  }
  .sentencesText {
    width: 70%
  }
  .buttonsArea {
    width: 30%
  }
  .big-textarea {
    height: 120px;
    margin-left: 10%;
    margin-top: 20px;
    width: 80%;
    font-size: 16px;
  }
  .small-elbutton {
    margin: 5px 10px;
    padding: 8px 16px;
  }
</style>