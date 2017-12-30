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
              <el-input placeholder="请输入邮箱号" v-model="username" clearable>
                <template slot="prepend">邮箱号</template>
              </el-input>
            </div>
            <div class="normal-input">
              <el-input placeholder="请输入验证码" v-model="username" clearable>
                <template slot="prepend">验证码</template>
                <el-button type="primary" slot="append" @click="sendIdenCode">
                <span>发送验证码</span>
                </el-button>
              </el-input>
              <el-button type="primary" class="next-button" @click="nextStep">下一步</el-button>
            </div>
          </div>
          <div v-if="choosenType===1">
            <div class="normal-input">
              <el-input placeholder="请输入验证码" v-model="username" clearable>
                <template slot="prepend">验证码</template>
              </el-input>
              <el-button type="primary" class="next-button" @click="nextStep">下一步</el-button>
            </div>
          </div>
        </div>
        <div v-else-if="status === 3">
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
      </template>
    </div>    
  </div>
</template>

<script>

export default {
  data () {
    return {
      username: '',
      password: '',
      password2: '',
      usertype: '1',
      status: 1,      // 1, 2, 3, 4 represents for status respectively
      choosenType: 0  // 0: admin 1: operator
    }
  },
  computed: {
    signupFlag () {
      return (this.username === '' || this.password === '' || this.password2 === '') && this.status === 3
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
    nextStep () {
      if (this.status === 2) {
        if (this.choosenType === 0) {
          this.status = 3
        } else {
          this.status = 3
        }
        return
      }
      if (this.status === 3) {
        if (this.choosenType === 0) {
          this.status = 4
        } else {
          this.status = 4
        }
      }
    },
    sendIdenCode () {
      /*
      this.$http.post(, {
      }).then(function (response) {
      })
      */
    }
  }
}
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
