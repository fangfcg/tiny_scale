<template>
  <div class="main-contain">
    <span class="title-text">管理员邀请</span><br><br>
    <span class="title-warning">请选择邀请客服的人数并点击获取按钮，系统将会为您申请客服邀请码</span><br>
    <span class="title-warning">注意：一天申请邀请码的上限为20个，同时获得邀请码后请在切换页面前保存到本地，因为切换页面后之前申请邀请码将无法获取</span>
    <hr width=80% size=1 color=#c5c5c5 style="FILTER: alpha(opacity=100,finishopacity=0,style=3)"> 
    <template>
      <el-select v-model="choosenNum" placeholder="请选择邀请客服人数">
        <el-option
          v-for="value in options"
          :key="value"
          :label="value"
          :value="value">
        </el-option>
      </el-select>
      <el-button type="primary" @click="getInviteCode">获取</el-button>
    </template>
    <hr width=80% size=1 color=#c5c5c5 style="FILTER: alpha(opacity=100,finishopacity=0,style=3)"> 
    <div><span class="title-text">邀请码列表</span></div>

    <el-table
        :data="codeArray"
        :stripe="true"
        style="width: 90%">
        <el-table-column
        label="序号"
        prop="index">
        </el-table-column>
        <el-table-column
        label="邀请码"
        prop="code">
        </el-table-column>
    </el-table>

  </div>
</template>

  </div>
</template>

<script>
export default {
  created () {
  },
  data () {
    return {
      inputNum: '',
      options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      choosenNum: 0,
      codeArray: []
    }
  },
  computed: {
  },
  methods: {
    getInviteCode () {
      if (this.choosenNum === 0) {
        return
      }
      this.codeArray = []
      for (var j = 0; j < this.choosenNum; j++) {
        this.codeArray.push({ index: j, code: j * 100 })
      }
      console.log(this.choosenNum)
      this.choosenNum = 0
    }
  }
}
</script>

<style lang='less'>
  .main-contain {
    padding:0% 15% 0 15%;
  }
  .title-text {
    font-size:25px;
  }
  .title-warning {
    font-size:13px;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .main-text {
    font-size:20px;
    margin-top:20px;
  }
  .small-title {
    font-size:20px;
    color:#ff0000;
    display: block;
    text-align: center;
  }
  .sentencesText {
    width: 70%
  }
  .buttonsArea {
    width: 30%
  }
  .big-textarea {
    height: 120px;
    margin-left: 10%;
    margin-top: 20px;
    width: 80%;
    font-size: 16px;
  }
  .small-elbutton {
    margin: 5px 10px;
    padding: 8px 16px;
  }
  .avatar-uploader .el-upload {
    margin-top:20px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .name-input, .email-input {
    width:200px;
    margin-top:20px;
    margin-right:40px;
  }

</style>