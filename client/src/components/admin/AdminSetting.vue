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
    <span class="main-text">管理员快捷回复设置 <el-button style="margin-left:100px" @click="getAdminReply()">设置</el-button></span><br>
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
  async created () {
    let res = await this.$http.get(this.serverIp + '/api/get_profile')
    let response = res.data
    this.inputName = response.name
    this.inputEmail = response.email
    this.imageUrl = this.serverIp + '/' + response.imgUrl
    console.log(response.imgUrl)
    this.$store.state.admin.name = this.inputName
    this.$store.state.admin.email = this.inputEmail
    this.$store.state.admin.imgUrl = this.imageUrl
  },
  data () {
    return {
      imageUrl: this.$store.state.admin.imgUrl,
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
      addTitle: '',
      compData: [{text: '您好！'}, {text: '请您稍等，我为您转接更专业的负责人员'}, {text: '这个是我们公司的官网'}, {text: '这是我们公司的最新产品'}]
    }
  },
  computed: {
    uploadImageUrl () {
      return this.$store.state.admin.serverIp + '/api/upload_portrait'
    },
    serverIp () {
      return this.$store.state.admin.serverIp
    }
  },
  methods: {
    handleAvatarSuccess (res, file) {
      this.imageUrl = this.$store.state.admin.serverIp + '/' + res
      this.$store.state.admin.imgUrl = this.imageUrl
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
    async nameSubmit () {
      if (this.inputName === '') {
        this.$message({
          message: '昵称不能为空',
          type: 'fail'
        })
        return
      }
      this.nameLoading = true
      let res = await this.$http.post(this.serverIp + '/api/common/settings/profile', {
        type: 'admin',
        name: this.inputName,
        email: this.inputEmail
      })
      let response = res.data
      if (response.success === true) {
        this.nameLoading = false
        this.nameButtonFlag = true
        this.nameInputFlag = true
      } else {
        this.nameLoading = false
      }
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
        this.inputEmail = this.$store.state.admin.email
      }
      this.emailButtonFlag = !this.emailButtonFlag
      this.emailInputFlag = !this.emailInputFlag
    },
    async emailSubmit () {
      if (this.inputEmail === '') {
        this.$message({
          message: '邮箱不能为空',
          type: 'fail'
        })
        return
      }
      this.emailLoading = true
      let res = await this.$http.post(this.serverIp + '/api/common/settings/profile', {
        type: 'admin',
        name: this.inputName,
        email: this.inputEmail
      })
      let response = res.data
      if (response.success === true) {
        this.emailLoading = false
        this.emailButtonFlag = true
        this.emailInputFlag = true
      } else {
        this.emailLoading = false
      }
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
    addHandleClose () {
      this.addDialogVisible = false
    },
    delReply (id) {
      this.compData.splice(id, 1)
      this.renewReply()
    },
    upReply (id) {
      let strFormerUp = this.compData[id - 1].text
      let strNewUp = this.compData[id].text
      this.compData[id].text = strFormerUp
      this.compData[id - 1].text = strNewUp
      this.renewReply()
    },
    downReply (id) {
      let strFormerDown = this.compData[id + 1].text
      let strNewDown = this.compData[id].text
      this.compData[id].text = strFormerDown
      this.compData[id + 1].text = strNewDown
      this.renewReply()
    },
    addDialogClose () {
      this.addDialogVisible = false
      if (this.replyID === this.compData.length) {
        this.compData.push({text: this.rawText})
      } else {
        this.compData[this.replyID].text = this.rawText
      }
      this.renewReply()
    },
    openAddDialog (id) {
      this.replyID = id
      this.addDialogVisible = true
      if (id === this.compData.length) {
        this.rawText = ''
        this.addTitle = '新建回复（最大长度为150字）'
      } else {
        this.rawText = this.compData[id].text
        this.addTitle = '修改第' + (id + 1) + '号回复（最大长度为150字）'
      }
    },
    selfHandleClose () {
      this.selfDialogVisible = false
    },
    async getAdminReply () {
      let res = await this.$http.get(this.serverIp + '/api/common/settings/adminReply')
      let response = res.data
      if (response.success === true) {
        this.compData = response.data
        this.selfDialogVisible = true
      } else {
        this.$message.error('打开失败，请重试！')
      }
    },
    async renewReply () {
      let res = await this.$http.post(this.serverIp + '/api/common/settings/renewReply', {
        data: this.compData
      })
      let response = res.data
      if (response.success === true) {
        this.$message({
          message: '信息更新成功！',
          type: 'success'
        })
        return true
      } else {
        this.$message.error('信息更新失败，请重试！')
        return false
      }
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