<template>
    <div id="chatindex">
    <el-container>
      <el-header>
        <el-row type="flex" :gutter="10">
          <el-col :span="4">
            <!--<router-link to="/CustomMenu"> -->
              <img class="logo" width="167" height="50" src="../../assets/logoall.jpg" alt="nopic" />
            <!--</router-link> -->
          </el-col>
          <el-col :span="4" :offset="2">
            <el-menu class="el-menu-demo" :router=true mode="horizontal" default-active="/CustomMenu" >
                <el-menu-item class="menuitem" index="/CustomMenu">客服界面</el-menu-item>
                <el-menu-item class="menuitem" index="/CustomTalk">会话界面</el-menu-item>
            </el-menu>
          </el-col>
          <el-col :span="2" :offset="10" class="dropdown">
            <el-dropdown @command="statusChange">
              <span class="el-dropdown-link">
                {{statusList[nowStatus].statu}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <template v-for="item in statusList">
                  <el-dropdown-item v-if="item.num === nowStatus" :key="item.num" :command="item.statu" disabled>
                    {{item.statu}}
                  </el-dropdown-item>
                  <el-dropdown-item v-else :key="item.num" :command="item.statu">
                    {{item.statu}}
                  </el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
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
    this.$store.commit('initSock')
  },
  data () {
    return {
      statusList: [{num: 0, statu: '在线'}, {num: 1, statu: '离线'}],
      nowStatus: this.$store.state.chat.operatorStatus
    }
  },
  methods: {
    statusChange (command) {
      for (let item of this.statusList) {
        if (item.statu === command) {
          this.$store.state.chat.operatorStatus = item.num
          this.nowStatus = item.num
          const h = this.$createElement
          this.$message({
            message: h('p', null, [
              h('span', null, '您的状态已经切换为 '),
              h('i', { style: 'color: teal' }, command)
            ])
          })
          break
        }
      }
    }
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
