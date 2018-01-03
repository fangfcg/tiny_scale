<template>
  <div class="main-container">
    <div class="content">
      <span class="login-title">注册TinyScale</span>
      <el-steps :active="status" align-center class="steps">
        <el-step title="选择注册类型"></el-step>
        <el-step title="输入验证码" ></el-step>
        <el-step title="输入账号密码"></el-step>
      </el-steps>
      <template>
        <div v-if="status === 1">
          <el-button class="choose-type-button" @click="chooseAdmin">管理员注册</el-button><br>
          <el-button  class="choose-type-button" @click="chooseOperator">客服注册</el-button><br>
        </div>
        <div v-else-if="status === 2">
          <div v-if="choosenType===0">
            <div class="normal-input">
              <el-input placeholder="请输入邮箱号" v-model="emailNum" clearable>
                <template slot="prepend">邮箱号</template>
              </el-input>
            </div>
            <div class="normal-input">
              <el-input placeholder="请输入验证码" v-model="certiCode" clearable>
                <template slot="prepend">验证码</template>
                <el-button type="primary" slot="append" @click="sendIdenCode" :disabled="emailSendDisabled">
                <span>发送验证码</span>
                </el-button>
              </el-input>
              <el-button type="primary" class="next-button" @click="nextStep">下一步</el-button>
            </div>
          </div>
          <div v-if="choosenType===1">
            <div class="normal-input">
              <el-input placeholder="请输入验证码" v-model="inviteCode" clearable>
                <template slot="prepend">验证码</template>
              </el-input>
              <el-button type="primary" class="next-button" @click="nextStep">下一步</el-button>
            </div>
          </div>
        </div>
        <div v-else-if="status === 3">
          <div v-if="choosenType===0">
            <div class="normal-input2">
            <el-input placeholder="请输入公司名称" v-model="companyName" clearable>
              <template slot="prepend">公司名称</template>
            </el-input>
          </div>
          </div>
          <div class="normal-input2">
            <el-input placeholder="请输入账号" v-model="username" clearable>
              <template slot="prepend">账号</template>
            </el-input>
          </div>
          <div class="normal-input2">
            <el-input placeholder="请输入密码" v-model="password" clearable>
              <template slot="prepend">密码</template>
            </el-input>
          </div>
          <div class="normal-input2">
            <el-input placeholder="请再次输入密码" v-model="password2" clearable>
              <template slot="prepend">确认密码</template>
            </el-input>
          </div>
          <el-button type="primary" class="next-button" :disabled="signupFlag" @click="nextStep">下一步</el-button><br>
        </div>
        <div v-else-if="status === 4">
          <div>注册成功!</div>
          <router-link to="/signin">
            <el-button>返回登录界面</el-button>
          </router-link>
        </div>
      </template>
    </div>    
  </div>
</template>

<script>

var Login = {
  data () {
    return {
      certiCode: '',
      inviteCode: '',
      username: '',
      password: '',
      password2: '',
      usertype: '1',
      companyName: '',
      emailNum: '',
      status: 1,      // 1, 2, 3, 4 represents for status respectively
      choosenType: 0,  // 0: admin 1: operator
      emailSendDisabled: false,
      emailSendFlag: false
    }
  },
  computed: {
    signupFlag () {
      return (this.username === '' || this.password === '' || this.password2 === '') && this.status === 3
    },
    sendEmailUrl () {
      return (this.$store.state.serverIp + '/api/admin/signup/get_certificate')
    },
    adminCertificateUrl () {
      return (this.$store.state.serverIp + '/api/admin/signup/certificate')
    },
    operatorCertificateUrl () {
      return (this.$store.state.serverIp + '/api/operator/signup/certificate')
    },
    adminCreateUrl () {
      return (this.$store.state.serverIp + '/api/admin/signup/create_admin')
    },
    operatorCreateUrl () {
      return (this.$store.state.serverIp + '/api/operator/signup/create_operator')
    }
  },
  methods: {
    chooseAdmin () {
      this.choosenType = 0
      this.status = 2
    },
    chooseOperator () {
      this.choosenType = 1
      this.status = 2
    },
    async nextStep () {
      if (this.status === 2) {
        if (this.choosenType === 0) {
          if (this.certiCode === '') {
            return
          }
          let res = await this.$http.post(this.adminCertificateUrl, {
            certificate: this.certiCode
          })
          let response = res.data
          if (response.success === true) {
            this.status = 3
          }
          if (this.status !== 3) {
            this.$message.error('验证码错误，请重试')
          }
        } else {
          if (this.inviteCode === 0) {
            return
          }
          let res = await this.$http.post(this.operatorCertificateUrl, {
            certificate: this.inviteCode
          })
          let response = res.data
          if (response.success === true) {
            this.status = 3
          }
          if (this.status !== 3) {
            this.$message.error('验证码错误，请重试')
          }
        }
        return
      }
      if (this.status === 3) {
        if (this.choosenType === 0) {
          if (this.companyName === '' || this.password === '' || this.password2 === '' || this.username === '') {
            return
          }
          if (this.password !== this.password2) {
            this.$message.error('两次密码输入不一致，请重试')
            return
          }
          let res = await this.$http.post(this.adminCreateUrl, {
            companyName: this.companyName,
            name: this.username,
            pass: this.password
          })
          let response = res.data
          if (response.success === true) {
            this.status = 4
          }
          if (this.status !== 4) {
            this.$message.error('注册失败，请重试')
          }
        } else {
          if (this.password === '' || this.password2 === '' || this.username === '') {
            return
          }
          if (this.password !== this.password2) {
            this.$message.error('两次密码输入不一致，请重试')
            return
          }
          let res = await this.$http.post(this.operatorCreateUrl, {
            name: this.username,
            pass: this.password
          })
          let response = res.data
          if (response.success === true) {
            this.status = 4
          }
          if (this.status !== 4) {
            this.$message.error('注册失败，请重试')
          }
        }
      }
    },
    async sendIdenCode () {
      if (this.emailNum === '') {
        return
      }
      this.emailSendDisabled = true
      let res = await this.$http.post(this.sendEmailUrl, {
        email: this.emailNum
      })
      let response = res.data
      if (response.success === true) {
        this.emailSendFlag = true
      } else {
        this.emailSendFlag = false
      }
      if (this.emailSendFlag === true) {
        this.$message({
          message: '发送邮件成功',
          type: 'success'
        })
      } else {
        this.$message.error('发送邮件失败')
      }
      this.emailSendDisabled = false
    }
  }
}

export default Login
</script>

<style>
.main-container {
  padding-top: 50px;
  padding-bottom: 50px;
  text-align: center;
  background-color: #e2e2e2;
}
.content {
  width: 500px;
  height: 300px;
  margin:auto;
  background-color: white;
}
.login-title {
  font-size: 30px;
  margin:0px auto auto auto;
}
.steps {
  margin-top: 20px;
  margin-bottom: 30px;
}
.content {
  padding-top:50px;
  padding-right: 30px;
  padding-bottom: 50px;
  padding-left: 30px;
}
hr {
  margin: 20px auto;
}
.username-input, .password-input, .normal-input {
  width: 350px;
  margin: 20px auto;
}
.normal-input2 {
  width: 350px;
  margin: 5px auto;
}
.next-button {
  width: 200px;
  margin-top:20px;
  margin-bottom: 20px;
}
.link-text {
  font-size: 14px;
}
.choose-type-button {
  width: 200px;
  margin-top: 25px;
  font-size:18px;
}
</style>
