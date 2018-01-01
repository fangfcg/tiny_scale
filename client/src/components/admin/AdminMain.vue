<template>
  <div class="main-container">
    <el-carousel indicator-position="outside">
      <el-carousel-item v-for="item in 4" :key="item">
        <h3>{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>
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
          <el-table-column label="客服昵称" prop="name"> </el-table-column>
          <el-table-column label="队列人数" prop="waitingNum"> </el-table-column>
          <el-table-column label="当前处理人数" prop="currentNum"> </el-table-column>
          <el-table-column label="客服状态" prop="status"></el-table-column>
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
          <el-table-column label="工单类型" prop="type"> </el-table-column>
          <el-table-column label="处理客服" prop="operatorName"> </el-table-column>
          <el-table-column label="处理完成时间" prop="finishTime"> </el-table-column>
          <el-table-column label="满意度" prop="score"></el-table-column>
        </el-table>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableOperator: [
        {
          name: '小明',
          waitingNum: 1,
          currentNum: 2,
          finishNum: 3,
          status: '在线'
        },
        {
          name: '小明',
          waitingNum: 1,
          currentNum: 2,
          finishNum: 3,
          status: '休息'
        }
      ],
      tableWorkRecord: [
        {
          type: '客服',
          operatorName: '小明',
          finishTime: '19970109',
          score: 5
        },
        {
          type: '留言',
          operatorName: '小明',
          finishTime: '19970109',
          score: 5
        }
      ]
    }
  },
  methods: {
    tableRowClassName ({row, rowIndex}) {
      if (row.status === '在线') {
        return 'working-row'
      } else if (row.status === '休息') {
        return 'rest-row'
      }
      return ''
    }
  }
}
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
</style>