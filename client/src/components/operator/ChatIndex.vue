<template>
    <div id="chatindex">
    <el-container>
      <el-header>
        <el-row type="flex" :gutter="10">
          <el-col :span="4">
              <img class="logo" width="167" height="50" src="assets/logoall.jpg" alt="nopic" />
          </el-col>
          <el-col :span="6" :offset="2">
            <el-menu class="el-menu-demo" :router=true mode="horizontal" default-active="/CustomMenu" >
                <el-menu-item class="menuitem" index="/CustomMenu">客服界面</el-menu-item>
                <el-menu-item class="menuitem" index="/CustomTalk">会话界面</el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
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
    this.$store.commit('initSock')
  },
  data () {
    return {
      statusList: [{num: 0, statu: '在线'}, {num: 1, statu: '休息'}]
    }
  },
  computed: {
    listenWaitingNum () {
      return this.$store.state.chat.waitingNum
    },
    listenStatus () {
      return this.$store.state.chat.operatorStatus
    }
  },
  watch: {
    listenWaitingNum: function (val, oldval) {
      if (val === oldval - 1) {
        this.$notify({
          title: '接入成功',
          message: '接入新用户' + this.$store.state.chat.currentUser.toString(),
          position: 'bottom-right',
          type: 'success'
        })
      }
    }
  },
  methods: {
    statusChange (command) {
      for (let item of this.statusList) {
        if (item.statu === command) {
          this.$store.state.chat.operatorStatus = item.num
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
    },
    getGuest () {
      if (this.$store.state.chat.waitingNum <= 0) {
        this.$notify.error({
          title: '接入失败',
          message: '队列中没有等待的客户',
          position: 'bottom-right'
        })
        return
      }
      this.$store.commit('getNext')
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
.top-button {
  margin-top:20px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #006ddd;
  font-size: 15px;
}
#getGuestButton {
  cursor: pointer;
  color: #006ddd;
  font-size: 16px;
}

</style>
