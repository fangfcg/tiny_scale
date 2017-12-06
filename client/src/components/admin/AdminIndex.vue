<template>
    <div id="chatindex">
    <el-container>
      <el-header>
        <el-row type="flex" :gutter="10">
          <el-col :span="4">
            <!--<router-link to="/CustomMenu"> -->
              <img class="logo" width="167" height="50" src="assets/logoall.jpg" alt="nopic" />
            <!--</router-link> -->
          </el-col>
          <el-col :offset="2">
            <el-menu class="el-menu-demo" mode="horizontal" :router="true">
                <el-menu-item class="menuitem" index="/Main">管理员首页</el-menu-item>
                <el-menu-item class="menuitem" index="/Data">数据信息</el-menu-item>
                <el-menu-item class="menuitem" index="/Settings">设置</el-menu-item>
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
  created () {
  },
  data () {
    return {
      DataList: [{id: 0, data: '会话量'}, {id: 1, data: '人工接入率'}, {id: 2, data: '消息数'}, {id: 3, data: '满意度'}, {id: 4, data: '参评率'}, {id: 5, data: '问答比'}, {id: 6, data: '平均响应时间'}]
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