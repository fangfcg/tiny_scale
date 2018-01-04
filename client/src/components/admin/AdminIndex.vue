<template>
    <div id="chatindex">
    <el-container>
      <el-header>
        <el-row type="flex" :gutter="10">
          <el-col :span="4">
            <img class="logo" width="167" height="50" src="/static/logoall.jpg" alt="nopic" />
          </el-col>
          <el-col :offset="2">
            <el-menu class="el-menu-demo" mode="horizontal" :router="true">
                <el-menu-item class="menuitem" index="/Main">管理员首页</el-menu-item>
                <el-menu-item class="menuitem" index="/Data">数据信息</el-menu-item>
                <el-menu-item class="menuitem" index="/Robot">机器人设置</el-menu-item>
                <el-menu-item class="menuitem" index="/Settings">其它设置</el-menu-item>
                <el-menu-item class="menuitem" index="/Invite">客服邀请</el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </el-header>
      <el-aside>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  async created () {
    let res = await this.$http.get(this.$store.state.admin.serverIp + '/api/get_profile')
    let response = res.data
    this.$store.state.admin.name = response.name
    this.$store.state.admin.email = response.email
    this.$store.state.admin.imgUrl = this.$store.state.admin.serverIp + '/' + response.imgUrl
    res = await this.$http.get(this.$store.state.admin.serverIp + '/api/admin/get_socket_token')
    response = res.data
    if (res.token !== null) {
      this.$store.state.admin.token = res.token
    }
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style>
#chatindex {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.menuitem {
  font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
  font-weight: 400;
  font-size: 16px;
  text-align: center;
}
.logo {
  margin-top:10px;
}
.dropdown {
  margin-top:20px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #006ddd;
}
</style>