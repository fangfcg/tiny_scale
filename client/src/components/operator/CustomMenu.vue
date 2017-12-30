<template>
<div class="customServiceMenu">
    <span id="title-text">客服工作台</span>
    <el-row class="customerSettings" :gutter="30">
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
        
</div>
</template>

<script>
  export default {
    name: 'customServiceMenu',
    data: function () {
      return {
      }
    },
    methods: {
    }
  }
</script>

<style>
  .customServiceMenu {
    padding:0% 10% 0 10%;
  }
  #title-text {
    margin-left: 40%;
    font-size: 35px;
  }
  .customerSettings {
    font-size: 25px;
    margin-top: 30px;
  }
  .clearfix {
    font-size: 18px;
  }
  .get-guest-button {
    margin-top:50px;
  }
  .listcontent {
    text-align: center;
  }
  #get-guest-button {
    margin-top:50px;
    margin-left:43%;
    font-size:20px;
  }
</style>