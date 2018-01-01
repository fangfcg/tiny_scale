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
  </div>
</template>

<script>
export default {
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
      emailLoading: false
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
          this.$message({
            message: '昵称修改成功',
            type: 'success'
          })
          this.nameLoading = false
          this.nameButtonFlag = true
          this.nameInputFlag = true
          this.$store.state.admin.name = this.inputName
        } else {
          this.$message({
            message: '昵称修改失败，请重试',
            type: 'fail'
          })
          this.nameLoading = false
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
          this.$message({
            message: '邮箱修改成功',
            type: 'success'
          })
          this.emailLoading = false
          this.emailButtonFlag = true
          this.emailInputFlag = true
          this.$store.state.admin.email = this.inputEmail
        } else {
          this.$message({
            message: '邮箱修改失败，请重试',
            type: 'fail'
          })
          this.emailLoading = false
        }
      })
    }
  }
}
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

</style>