<template>
<div class="customServiceMenu">
    <el-row class="customerSettings">
        <el-col :span="8" class="cSettingCol">
            队列人数<br />
            {{this.$store.state.waitingNum}}
        </el-col>
        <el-col :span="8" class="cSettingCol">
            当前服务人数<br />
            {{this.$store.state.customerNum}}
        </el-col>
        <el-col :span="8" class="cSettingCol">
            本次已服务人数<br />
            {{this.$store.state.todayNum}}
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="12">
            当前状态:
            <div style="color:red">
                <div v-if="this.isSleeping">休息中</div>
                <div v-else>工作中</div>
            </div>
        </el-col>
        <el-button type="primary" @click="getGuest">接入</el-button>
        <el-button type="primary" @click="sleepService" id="sleepButton">
            <div v-if="this.isSleeping">恢复工作</div>
            <div v-else>休息</div>
        </el-button>
    </el-row>
</div>
</template>

<script>
  export default {
    name: 'customServiceMenu',
    data: function () {
      return {
        isSleeping: false
      }
    },
    methods: {
      getGuest: function () {
        this.$store.commit('getNext')
        /* if (this.isSleeping === true) {
          alert('当前处于休息状态，不允许接入新的客户！')
        } else if (this.$store.state.waitingNum <= 0) {
          alert('错误！当前没有用户在队列中')
        } else {
          this.$store.commit('getNext')
        } */
      },
      sleepService: function () {
        if (this.isSleeping === true) {
          this.isSleeping = false
        } else {
          this.isSleeping = true
        }
      }
    }
  }
</script>

<style>
  .customerSettings {
    font-size: 25px;
  }
  .cSettingCol{
    padding:20px 20px;
    background: #9Fe400;
    border:10px solid white;
  }
</style>