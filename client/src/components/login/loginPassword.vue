<template>
  <div class="main-container">
    <div class="content">
      <span class="login-title">找回密码</span>
      <el-steps :active="status" align-center class="steps">
        <el-step title="选择用户类型"></el-step>
        <el-step title="输入验证码" ></el-step>
        <el-step title="输入新密码"></el-step>
      </el-steps>
      <template>

        <div v-if="status === 1">
          <el-button class="choose-type-button" @click="chooseAdmin">管理员</el-button><br>
          <el-button  class="choose-type-button" @click="chooseOperator">客服</el-button><br>
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
          <div class="normal-input2">
            <el-input placeholder="请输入新密码" v-model="password" clearable>
              <template slot="prepend">新密码</template>
            </el-input>
          </div>
          <div class="normal-input2">
            <el-input placeholder="请再次输入密码" v-model="password2" clearable>
              <template slot="prepend">确认密码</template>
            </el-input>
            <el-button type="primary" class="next-button" :disabled="signupFlag" @click="nextStep">下一步</el-button><br>
          </div>
        </div>

        <div v-else-if="status === 4">
          <div>密码修改成功!</div>
          <router-link to="/signin">
            <el-button>返回登录界面</el-button>
          </router-link>
        </div>

      </template>
    </div>    
  </div>
</template>

<script>

var Password = {
  data () {
    return {
      certiCode: '',
      password: '',
      password2: '',
      usertype: '1',
      emailNum: '',
      status: 1,      // 1, 2, 3, 4 represents for status respectively
      choosenType: 0,  // 0: admin 1: operator
      emailSendDisabled: false,
      emailSendFlag: false
    }
  },
  computed: {
    serverIp () {
      return this.$store.state.serverIp
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
    async sendIdenCode () {
      if (this.emailNum === '') {
        return
      }
      this.emailSendDisabled = true
      let typeUser = this.choosenType === 0 ? 'admin' : 'operator'
      let res = await this.$http.post(this.serverIp + '/api/find_pass/get_certificate', {
        email: this.emailNum,
        type: typeUser
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
    },
    async nextStep () {
      if (this.status === 2) {
        if (this.certiCode === '') {
          return
        }
        let res = await this.$http.post(this.serverIp + '/api/find_pass/certificate', {
          certificate: this.certiCode
        })
        let response = res.data
        if (response.success) {
          this.status = 3
        }
        if (this.status !== 3) {
          this.$message.error('验证码错误，请重试')
        }
        return
      }
      if (this.status === 3) {
        if (this.password === '' || this.password2 === '') {
          return
        }
        if (this.password !== this.password2) {
          this.$message.error('两次密码输入不一致，请重试')
          return
        }
        let res = await this.$http.post(this.serverIp + '/api/find_pass/new_pass', {
          newPass: this.password
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
  }
}

export default Password
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
