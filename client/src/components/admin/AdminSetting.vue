<template>
  <div class="main-contain">
    <span class="title-text">其它设置</span>
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
    <span class="main-text">logo设置</span><br>
    <hr width=80% size=1 color=#c5c5c5 style="FILTER: alpha(opacity=100,finishopacity=0,style=3)"> 
    <span class="main-text">管理员快捷回复设置 <el-button style="margin-left:100px" @click="selfDialogVisible = true">设置</el-button></span><br>
    <el-dialog
        title="快捷回复设置"
        :visible.sync="selfDialogVisible"
        width="70%"
        :before-close="selfHandleClose">
        <div style="text-align: center"> <el-button class="small-elbutton" @click="openAddDialog(compData.length)">新建回复</el-button> </div>

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
          :data="compData"
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
                <el-button class="small-elbutton" v-if="scope.$index != compData.length-1" @click="downReply(scope.$index)">下移</el-button>
              
            </template>
          </el-table-column>
        </el-table>

        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="selfDialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
var setting = {
  data () {
    return {
      imageUrl: '',
      inputName: this.$store.state.admin.name,
      inputEmail: this.$store.state.admin.email,
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
      return this.$store.state.admin.serverIp + '/files'
    },
    uploadNameUrl () {
      return this.$store.state.admin.serverIp
    },
    uploadEmailUrl () {
      return this.$store.state.admin.serverIp
    },
    compData () {
      return this.$store.state.compData
    }
  },
  methods: {
    handleAvatarSuccess (res, file) {
      console.log('success')
      console.log(file)
      this.imageUrl = this.$store.state.admin.serverIp + res
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
        this.inputName = this.$store.state.admin.name
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
      this.$http.post(this.uploadNameUrl, {
        name: this.inputName
      }).then(function (response) {
        if (response.state === 'success') {
          setting.$message({
            message: '昵称修改成功',
            type: 'success'
          })
          setting.nameLoading = false
          setting.nameButtonFlag = true
          setting.nameInputFlag = true
          setting.$store.state.admin.name = setting.inputName
        } else {
          setting.$message({
            message: '昵称修改失败，请重试',
            type: 'fail'
          })
          setting.nameLoading = false
        }
      })
    },
    emailModify () {
      if (this.emailButtonFlag === false) {
        this.inputEmail = this.$store.state.admin.email
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
      this.$http.post(this.uploadEmailUrl, {
        email: this.inputEmail
      }).then(function (response) {
        if (response.state === 'success') {
          setting.$message({
            message: '邮箱修改成功',
            type: 'success'
          })
          setting.emailLoading = false
          setting.emailButtonFlag = true
          setting.emailInputFlag = true
          setting.$store.state.admin.email = this.inputEmail
        } else {
          setting.$message({
            message: '邮箱修改失败，请重试',
            type: 'fail'
          })
          setting.emailLoading = false
        }
      })
    },
    addHandleClose () {
      this.addDialogVisible = false
    },
    delReply (id) {
      this.compData.splice(id, 1)
    },
    upReply (id) {
      let strFormerUp = this.$store.state.compData[id - 1].text
      let strNewUp = this.$store.state.compData[id].text
      this.$store.state.compData[id].text = strFormerUp
      this.$store.state.compData[id - 1].text = strNewUp
    },
    downReply (id) {
      let strFormerDown = this.$store.state.compData[id + 1].text
      let strNewDown = this.$store.state.compData[id].text
      this.$store.state.compData[id].text = strFormerDown
      this.$store.state.compData[id + 1].text = strNewDown
    },
    updateReply (id, newMsg) {
      this.$store.state.compData[id].text = newMsg
    },
    addDialogClose () {
      this.addDialogVisible = false
      if (this.replyID === this.$store.state.compData.length) {
        this.$store.state.compData.push({text: this.rawText})
      } else {
        this.$store.state.compData[this.replyID].text = this.rawText
      }
    },
    openAddDialog (id) {
      this.replyID = id
      this.addDialogVisible = true
      if (id === this.$store.state.compData.length) {
        this.rawText = ''
        this.addTitle = '新建回复（最大长度为150字）'
      } else {
        this.rawText = this.compData[id].text
        this.addTitle = '修改第' + (id + 1) + '号回复（最大长度为150字）'
      }
    },
    selfHandleClose () {
      this.selfDialogVisible = false
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

</style>