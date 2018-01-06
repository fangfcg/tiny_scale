<template>
  <div class="main-container">
    <!--<el-carousel indicator-position="outside">
      <el-carousel-item v-for="item in 4" :key="item">
        <h3>{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>-->
    <div class="main-table">
      <div class="main-text">
      <span>客服状态</span>
      </div>
      <template>
        <el-table
          :row-class-name="tableRowClassName"
          :data="tableOperator"
          :stripe="true"
          style="width: 90%">
          <el-table-column label="客服名称" prop="name"> </el-table-column>
          <el-table-column label="客服id" prop="id"> </el-table-column>
          <el-table-column label="客服状态" prop="state"></el-table-column>
        </el-table>
      </template>
      <div class="main-text">
        <span>工单记录</span>
      </div>
      <template>
         <el-table
          :data="tableWorkRecord"
          :stripe="true"
          style="width: 90%">
          <el-table-column label="处理客服" prop="name" min-width="60"> </el-table-column>
          <el-table-column label="开始时间" prop="startTime"> </el-table-column>
          <el-table-column label="完成时间" prop="endTime"> </el-table-column>
          <el-table-column label="是否被评价" prop="commented"></el-table-column>
          <el-table-column label="满意度" prop="comment"></el-table-column>
          <el-table-column label="操作" min-width="80">
            <template slot-scope="props">
              <el-button size="mini" @click="handleDetail(props.row)">查看详情</el-button>
            </template>
          </el-table-column> 
        </el-table>
      </template>

      <el-dialog
        title="详情"
        :visible.sync="dialogVisible"
        width="40%">
        <el-table
          :data="chatData"
          :stripe="true"
          style="width: 90%">
          <el-table-column label="发送人" prop="sender"> </el-table-column>
          <el-table-column label="时间" prop="time"> </el-table-column>
          <el-table-column label="内容" prop="content"> </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <div class="main-text">
      <span>查看留言</span>
      </div>
      <el-pagination
        @current-change="pageChange"
        :current-page="currPage"
        :page-size="pagesize"
        layout="total, prev, pager, next, jumper"
        :total="leftMsgList.length">
        </el-pagination>
      <el-table
        :data="leftMsgList.slice((currPage - 1) * pagesize, currPage * pagesize)"
        style="width: 100%">
        <el-table-column type="expand">
        <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="留言时间">
                  <span>{{ props.row.leftTime }}</span>
              </el-form-item>
              <el-form-item label="具体留言">
                <span>{{ props.row.content }}</span>
            </el-form-item>
            <el-form-item label="回复时间">
                <span>{{ props.row.answerTime }}</span>
            </el-form-item>
            <el-form-item label="具体回复">
                <span>{{ props.row.answer }}</span>
            </el-form-item>
            </el-form>
        </template>
        </el-table-column>
        <el-table-column
        label="留言状态"
        prop="answerState">
        </el-table-column>
        <el-table-column
        label="客户Id"
        prop="customerId">
        </el-table-column>
        <el-table-column
        label="处理客服名"
        prop="operatorName">
        </el-table-column>
        <el-table-column
            label="留言内容（前10字）">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ cutString(scope.row.content) }}</span>
            </template>
          </el-table-column>
        <el-table-column
            label="回复内容（前10字）">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ cutString(scope.row.answer) }}</span>
            </template>
        </el-table-column>
      </el-table>

    </div>
  </div>
</template>

<script>
var adminMain = {
  async created () {
    var record
    var res1 = await this.$http.get(this.serverIp + `/api/admin/get_chat_list/${Date.now()}`)
    var response1 = res1.data
    record = response1
    for (var i of record) {
      i.commented = i.commented ? '是' : '否'
    }
    var res2 = await this.$http.get(this.serverIp + `/api/admin/operator_state_list/${Date.now()}`)
    var response2 = res2.data
    this.tableOperator = response2
    var res3 = await this.$http.get(this.serverIp + `/api/admin/group_info/${Date.now()}`)
    var response3 = res3.data
    this.operatorList = response3
    var res4 = await this.$http.get(this.serverIp + `/api/admin/message_lst/${Date.now()}`)
    var response4 = res4.data
    this.leftMsgList = response4
    for (let i = 0; i < this.leftMsgList.length; i++) {
      this.leftMsgList[i].leftTime = new Date(this.leftMsgList[i].leftTime).toLocaleString()
      if (this.leftMsgList[i].answerState === 0) {
        this.leftMsgList[i].answerState = '未回复'
        this.leftMsgList[i].answer = '暂无'
        this.leftMsgList[i].answerTime = '暂无'
        this.leftMsgList[i].operatorName = '暂无'
      } else if (this.leftMsgList[i].answerState === 1) {
        this.leftMsgList[i].answerState = '正在回复'
        this.leftMsgList[i].answer = '暂无'
        this.leftMsgList[i].answerTime = '暂无'
      } else if (this.leftMsgList[i].answerState === 2) {
        this.leftMsgList[i].answerState = '已回复'
        this.leftMsgList[i].answerTime = new Date(this.leftMsgList[i].answerTime).toLocaleString()
      }
    }
    for (let t = 0; t < this.tableOperator.length; t++) {
      if (this.tableOperator[t].state === 'left') {
        this.tableOperator[t].state = '离线'
      } else if (this.tableOperator[t].state === 'working') {
        this.tableOperator[t].state = '在线'
      } else {
        this.tableOperator[t].state = '休息'
      }
      this.tableOperator[t].name = this.operatorList[t].name
    }
    for (let t of record) {
      t.startTime = new Date(t.startTime).toLocaleString()
      t.endTime = new Date(t.endTime).toLocaleString()
      for (let i of this.operatorList) {
        if (t.operatorId === i.id) {
          t.name = i.name
          break
        }
      }
    }
    this.tableWorkRecord = record
  },
  data () {
    return {
      tableOperator: [],
      tableWorkRecord: [],
      chatData: [],
      dialogVisible: false,
      operatorList: [],
      leftMsgList: [],
      currPage: 1,
      pagesize: 2
    }
  },
  computed: {
    serverIp () {
      return this.$store.state.admin.serverIp
    }
  },
  methods: {
    pageChange: function (currPage) {
      this.currPage = currPage
    },
    cutString: function (msg) {
      if (msg.length <= 10) {
        return msg
      } else {
        return msg.substring(0, 10) + '...'
      }
    },
    tableRowClassName ({row, rowIndex}) {
      if (row.status === 'working') {
        return 'working-row'
      } else if (row.status === 'resting') {
        return 'rest-row'
      }
      return ''
    },
    async handleDetail (data) {
      var response = await this.$http.get(this.serverIp + `/api/admin/get_chat_log/${Date.now()}`, {
        params: {
          id: data.id
        }
      })
      let inputData = response.data
      this.chatData.splice(0, this.chatData.length)
      for (let d of inputData) {
        this.chatData.push({
          sender: d.sender === 'operator' ? '客服' : '客户',
          time: new Date(d.msg.time).toLocaleString(),
          content: d.msg.type === 'text' ? d.msg.content : '图片'
        })
      }
      this.chatData.reverse()
      this.dialogVisible = true
    }
  }
}
export default adminMain
</script>

<style>
.main-container {
  margin-left: 180px;
  margin-right: 180px;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
.main-text {
  font-size: 20px;
  margin-top:30px;
  margin-bottom: 30px;
}
.main-table {
  margin: 40px auto auto auto;
}
.el-table .rest-row {
  background: oldlace;
}
.el-table .working-row {
  background: #f0f9eb;
}
.operator-text {
  float: left;
}
.customer-text {
  float: left;
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
</style>