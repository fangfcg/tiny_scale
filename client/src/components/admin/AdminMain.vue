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
      operatorList: []
    }
  },
  computed: {
    serverIp () {
      return this.$store.state.admin.serverIp
    }
  },
  methods: {
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
</style>