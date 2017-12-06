<template>
<div class="customServiceMenu">
    <el-row class="customerSettings" :gutter="20">
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>队列人数</span>
            </div>
            <div class="listcontent">
              {{this.$store.state.chat.waitingNum}}
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>当前服务人数</span>
            </div>
            <div class="listcontent">
              {{this.$store.state.chat.currentNum}}
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>本次已服务人数</span>
            </div>
            <div class="listcontent">
              {{this.$store.state.chat.finishNum}}
            </div>
          </el-card>
        </el-col>
    </el-row>
    <el-row class="text-message">
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
  .customServiceMenu {
    text-align: center;
  }
  .customerSettings {
    font-size: 25px;
  }
  .cSettingCol{
    padding:20px 20px;
    background: #9Fe400;
    border:10px solid white;
  }
  .clearfix {
    font-size: 18px;
  }
  .text-message {
    margin-top: 50px;
  }
</style>