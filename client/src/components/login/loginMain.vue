<template>
  <div class="main-container">
    <div class="content">
      <span class="login-title">登录TinyScale</span>
      <!--<hr width=400px size=1 color=#c5c5c5 style="FILTER: alpha(opacity=100,finishopacity=0,style=3)">-->  
      <div class="username-input">
        <el-input placeholder="请输入账号" v-model="username" clearable>
          <template slot="prepend">账号</template>
        </el-input>
      </div>
      <div class="password-input">
        <el-input type="password" placeholder="请输入密码" v-model="password" clearable>
          <template slot="prepend">密码</template>
        </el-input>
      </div>
      <template>
        <el-radio v-model="usertype" label="1">客服</el-radio>
        <el-radio v-model="usertype" label="2">管理员</el-radio>
      </template><br>
      <el-button type="primary" class="login-button" :disabled="loginFlag" @click="login">登录</el-button><br>
      <router-link to="/signin">
        <span class="link-text">注册</span>
      </router-link>
      <span class="link-text">忘记密码</span>
      
    </div>    
  </div>
</template>

<script>

export default {
  data () {
    return {
      username: '',
      password: '',
      usertype: '1'
    }
  },
  computed: {
    loginFlag () {
      return this.username === '' || this.password === ''
    }
  },
  methods: {
    login () {
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
  margin:auto;
  background-color: white;
  border-radius:10px;
}
.login-title {
  font-size: 30px;
  margin:auto;
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
.username-input, .password-input {
  width: 350px;
  margin: 20px auto;
}
.login-button {
  width: 200px;
  margin-top:20px;
  margin-bottom: 20px;
}
.link-text {
  font-size: 14px;
}
</style>
