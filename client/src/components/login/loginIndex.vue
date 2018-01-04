<template>
  <div id="chatindex">
    <el-container>
    <el-header>
      <img class="logo" width="167" height="50" src="/static/logoall.jpg" alt="nopic" />
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  created () {
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
  position: absolute;
  left: 100px;
  top:10px;
}
.dropdown {
  margin-top:20px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #006ddd;
}
.title-text {
  position: absolute;
  top: 20px;
  left: 295px;
  font-size: 20px;
}
</style>