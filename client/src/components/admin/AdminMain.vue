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
          <el-table-column label="客服id" prop="operator"> </el-table-column>
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
          <el-table-column label="工单id" prop="id"> </el-table-column>
          <el-table-column label="处理客服" prop="operatorName"> </el-table-column>
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
        width="30%">
        <template v-for="msg in chatData">
          <template v-if="msg.sender === 'customer'" class="customer-text">{{msg.time + '客户:' + msg.content}}</template>
          <template v-else class="operator-text">{{msg.time + '客服:' + msg.content}}</template>
        </template>
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
    var res1 = await this.$http.get(this.serverIp + '/api/admin/get_chat_list')
    var response1 = res1.data
    this.tableWorkRecord = response1
    for (var i of this.tableWorkRecord) {
      i.commented = i.commented ? '是' : '否'
    }
    var res2 = await this.$http.get(this.serverIp + '/api/admin/operator_state_list')
    var response2 = res2.data
    this.tableOperator = response2
  },
  data () {
    return {
      tableOperator: [],
      tableWorkRecord: [],
      chatData: [],
      dialogVisible: false
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
      var response = await this.$http.get(this.serverIp + '/api/admin/get_chat_list', {
        params: {
          id: data.id
        }
      })
      this.chatData = response.data
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