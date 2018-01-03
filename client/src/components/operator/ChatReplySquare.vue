<template>
  <div class="main-contain">
    <span class="title-text">素质广场</span>
    <div v-if="this.$store.state.chat.isReplying === false">
      <el-pagination
        @current-change="pageChange"
        :current-page="currPage"
        :page-size="pagesize"
        layout="total, prev, pager, next, jumper"
        :total="this.$store.state.chat.leaveMsgList.length">
        </el-pagination>
      <el-table
        :data="this.$store.state.chat.leaveMsgList.slice((currPage - 1) * pagesize, currPage * pagesize)"
        style="width: 100%">
        <el-table-column type="expand">
        <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="具体留言">
                <span>{{ props.row.content }}</span>
            </el-form-item>
            </el-form>
        </template>
        </el-table-column>
        <el-table-column
        label="ID"
        prop="id">
        </el-table-column>
        <el-table-column
        label="时间"
        prop="time">
        </el-table-column>
        <el-table-column
            label="留言问题（前10字）">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ cutString(scope.row.content) }}</span>
            </template>
          </el-table-column>
        <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="danger" @click="getReply(scope.row.id, scope.row.content)">接取</el-button>
            </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="this.$store.state.chat.isReplying === true">
        <div class="formal-text">回答状态，请先回答完当先留言再进行留言选择</div>
        <div class="formal-text">当前留言：<span style="color:red">{{this.$store.state.chat.replyingMsg}}</span></div>
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请在此填写回复"
          v-model="replyText">
        </el-input>
        <div class="center-wrapper">
          <el-button type="primary" @click="replyEnd()">确定提交</el-button>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      fake: true, // 删
      currPage: 1,
      pagesize: 2,
      isAnswering: false,
      replyText: '',
      tableData5: [{
        id: '12987122',
        time: '2017-09-11',
        content: '这个东西是假的吧，怎么没有售后服务和购买方案呢？'
      }, {
        id: '12987123',
        time: '2017-09-11',
        content: '这个东西是假的吧，怎么没有帮助和指引呢？'
      }, {
        id: '12987125',
        time: '2017-09-11',
        content: '我应该去哪里进行售后服务和保修？'
      }, {
        id: '12987126',
        time: '2017-09-11',
        content: '我应该携带什么样的材料？'
      }, {
        id: '12987127',
        time: '2017-09-11',
        content: '有优惠方案吗？'
      }]
    }
  },
  computed: {
  },
  methods: {
    pageChange: function (currPage) {
      this.currPage = currPage
    },
    init: function () {
      // 获得当前的回复数据和对应的客服状态
      this.$store.commit('getLeaveMessageList')
    },
    cutString: function (msg) {
      if (msg.length <= 10) {
        return msg
      } else {
        return msg.substring(0, 10) + '...'
      }
    },
    getReply: function (id) {
      //  将对应的状态修改发到后端，修改对应的ID的回答情况，并且修改对应的客服的状态
      this.$store.commit('customGetLeaveMsg', id)
      if (this.$store.state.chat.isReplying === true) { // todo:将这一个部分改为“如果这个请求成功”
        this.$message({
          message: '接取留言成功！',
          type: 'success'
        })
      } else {
        this.$message.error('这条留言已经被其他客服抢先回复，请尝试别的留言吧！')
        this.init() // 刷新当前的页面
      }
    },
    replyEnd: function () {
      //  将对应的修改信息发到后端，
      if (this.$store.commit('customReplyMsg', this.replyText) === true) {
        this.$message({
            message: '留言为' + this.replyText + ',回复留言成功！',
            type: 'success'
        })
        this.isAnswering = false
        this.replyText = ''
        this.init()
      } else {
         this.$message.error('回复留言失败！')
      }
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
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .center-wrapper {
    text-align: center;
    margin-top: 20px;
  }
  .formal-text{
    font-size: 16px;
    margin: 10px 5px;  
  }
</style>