<template>
  <div class="main-contain">
    <el-container>
      <el-main>
        <el-container>
        <div class="search-type">
          <el-dropdown trigger="click" @command="dataTypeChange">
            <span class="el-dropdown-link">
              {{choosenDataType === null ? '数据类型' : DataList[choosenDataType].data}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <template v-for="item in DataList">
                <el-dropdown-item v-if="item.id === choosenDataType" :key="item.num" :command="item.id" disabled>
                  {{item.data}}
                </el-dropdown-item>
                <el-dropdown-item v-else :key="item.id" :command="item.id">
                  {{item.data}}
                </el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        
        <div class="search-type">
          <el-dropdown trigger="click" @command="operatorChange">
            <span class="el-dropdown-link">
              {{choosenOperator.id === null ? '总量' : choosenOperator.name}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item  v-if="choosenOperator.id===null" :key="0" :command="{id:null, name:null}" disabled>
                  总量
              </el-dropdown-item>
              <el-dropdown-item v-else :key="0" :command="{id:null, name:null}">
                  总量
              </el-dropdown-item>
              <template v-for="item in operatorList">
                <el-dropdown-item v-if="item.id === choosenOperator.id" :key="item.id" :command="item" disabled>
                  {{item.name}}
                </el-dropdown-item>
                <el-dropdown-item v-else :key="item.id" :command="item" >
                  {{item.name}}
                </el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        </el-container>
        <div class="block">
            日期查询选择
            <el-date-picker
              :disabled = "this.choosenDataType === null"
              v-model="value1"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changeData"
              :picker-options="pickerDate"
              class="samplebButton">
            </el-date-picker>
        </div>
        <div class="charts">
          <div id="myChart"></div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
var echarts = require('echarts')

function changeDateFormat (date) {
  var arrDate = date.split('-')
  var finalDate = new Date(arrDate[1] + '/' + arrDate[2] + '/' + arrDate[0])
  return finalDate
}

function getDateBetween (date1, date2) {
  //  我们假设date1一定在date2之前，这个是我们一定可以控制的
  var days = parseInt((date2 - date1) / 1000 / 3600 / 24)
  return days
}

export default {
  created () {
    this.$store.commit('getGroupList')
  },
  data () {
    return {
      value1: '',
      DataList: [{id: 0, data: '会话量'}, {id: 1, data: '人工接入率'}, {id: 2, data: '消息数'}, {id: 3, data: '满意度'}, {id: 4, data: '参评率'}, {id: 5, data: '问答比'}, {id: 6, data: '平均响应时间'}]
    }
  },
  computed: {
    choosenOperator () {
      return this.$store.state.admin.choosenOperator
    },
    choosenDataType () {
      return this.$store.state.admin.choosenDataType
    },
    operatorList () {
      return this.$store.state.admin.operatorList
    },
    startDate () {
      return this.$store.state.admin.startDate
    },
    endDate () {
      return this.$store.state.admin.endDate
    },
    pickerDate () {
      var date1 = this.$store.state.admin.startDate
      var date2 = this.$store.state.admin.endDate
      return {
        disabledDate (time) {
          if ((date1 === null) || (date2 === null)) {
            return true
          }
          return ((time < date1) || (time > date2))
        }
      }
    },
    dayNum () {
      if ((this.$store.state.admin.startDate === null) || (this.$store.state.admin.endDate === null)) {
        return 0
      }
      return getDateBetween(this.$store.state.admin.startDate, this.$store.state.admin.endDate) + 1
    },
    rawArr () {
      let retArray = Array(this.dayNum)
      for (let i = 0; i < this.dayNum; i++) {
        let d1 = this.$store.state.admin.startDate
        let d2 = new Date(d1)
        d2.setDate(d1.getDate() + i)
        let m = d2.getMonth() + 1
        retArray[i] = d2.getFullYear() + '-' + m + '-' + d2.getDate()
      }
      return retArray
    },
    dataArr () {
      return this.$store.state.admin.data
    }
  },
  mounted () {
    //  自适应高度和宽度
    var chartBox = document.getElementsByClassName('charts')[0]
    chartBox.style.height = '600px'
    var myChart = document.getElementById('myChart')
    myChart.style.width = chartBox.style.width
    myChart.style.height = chartBox.style.height
    var mainChart = echarts.init(myChart)
    var newTitle = '数据图表'
    mainChart.setOption({
      title: {
        left: 'center',
        text: newTitle
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        data: []
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'line',
        data: [],
        smooth: true
      }]
    })
  },
  methods: {
    changeData (obj) {
      var min = obj[0]
      var max = obj[1]
      var newDateArr
      var newArr
      if (min === null) {
        newDateArr = []
        newArr = []
      } else {
        var d = getDateBetween(changeDateFormat(min), changeDateFormat(max))
        var startPos = getDateBetween(this.$store.state.admin.startDate, changeDateFormat(min))
        newDateArr = this.rawArr.slice(startPos, startPos + d + 1)
        newArr = this.dataArr.slice(startPos, startPos + d + 1)
      }
      var mainChart = echarts.init(document.getElementById('myChart'))
      mainChart.setOption({
        title: {
          left: 'center',
          text: '数据图表'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: newDateArr
        },
        yAxis: {},
        series: [{
          name: this.DataList[this.choosenDataType].data,
          type: 'line',
          smooth: true,
          data: newArr
        }]
      })
    },
    dataTypeChange (command) {
      this.$store.state.admin.choosenDataType = command
      if (this.$store.state.admin.choosenOperator.id === null) {
        this.$store.commit('getGroupInfo')
      } else {
        this.$store.commit('getOperatorInfo')
      }
      if ((this.startDate === null) || (this.endDate === null)) {
        return
      }
      this.changeData([null, null])
    },
    operatorChange (command) {
      if (this.choosenDataType === null) {
        return
      }
      this.$store.state.admin.choosenOperator = command
      if (this.$store.state.admin.choosenOperator.id === null) {
        this.$store.commit('getGroupInfo')
      } else {
        this.$store.commit('getOperatorInfo')
      }
      if ((this.startDate === null) || (this.endDate === null)) {
        return
      }
      this.changeData([null, null])
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main-contain{
  padding-left: 200px;
  padding-right: 200px;
}
.sampleButton{
  margin:0 auto
}
.block{
  margin-top: 20px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #006ddd;
  font-size: 16px;
}
.search-type{
  margin-right:20px;
}
.dropdown {
  font-size:14px;
}
.charts {
  margin-top: 50px;
}
</style>
