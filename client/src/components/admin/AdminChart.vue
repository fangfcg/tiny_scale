<template>
  <div>
    <div class="block">
    <el-row>
      <el-col :span="8" :offset="8">
      日期查询选择
      <el-date-picker
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
      </el-col>
    </el-row>
  </div>
    <div class="charts">
      <div id="myChart"></div>
    </div>
    
  </div>
</template>

<script>
var mindate = '2017-1-1'
var maxdate = '2017-12-31'
var dayNum = getDateBetween(mindate, maxdate) + 1
console.log(dayNum)
var rawArr = Array(dayNum)
var ranArr = Array(dayNum)
console.log(rawArr)
for (var i = 0; i < dayNum; i++) {
  var d1 = new Date(mindate)
  d1.setDate(d1.getDate() + i)
  var m = d1.getMonth() + 1
  rawArr[i] = d1.getFullYear() + '-' + m + '-' + d1.getDate()
  ranArr[i] = parseInt(Math.random() * 20 + 5, 10)
}
console.log(ranArr)
function changeDateFormat (date) {
  var arrDate = date.split('-')
  var finalDate = new Date(arrDate[1] + '/' + arrDate[2] + '/' + arrDate[0])
  return finalDate
}
function getDateBetween (date1, date2) {
  //  我们假设date1一定在date2之前，这个是我们一定可以控制的
  var strDate1 = changeDateFormat(date1)
  var strDate2 = changeDateFormat(date2)
  var days = parseInt((strDate2 - strDate1) / 1000 / 3600 / 24)
  return days
}

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      value1: '',
      pickerDate: {
        disabledDate (time) {
          return (time.getTime() < changeDateFormat(mindate) || time.getTime() > changeDateFormat(maxdate))
        }
      }
    }
  },
  mounted () {
    var echarts = require('echarts')

    //  自适应高度和宽度
    var chartBox = document.getElementsByClassName('charts')[0]
    chartBox.style.height = '600px'
    var myChart = document.getElementById('myChart')
    myChart.style.width = chartBox.style.width
    myChart.style.height = chartBox.style.height
    var mainChart = echarts.init(myChart)
    var newTitle = this.$store.commit('getCurrType') + '数据图表'
    mainChart.setOption({
      title: {
        left: 'center',
        text: newTitle
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        data: rawArr
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'line',
        data: ranArr,
        smooth: true
      }]
    })
  },
  methods: {
    changeData (obj) {
      var min = obj[0]
      var max = obj[1]
      var d = getDateBetween(min, max)
      console.log(d)
      var startPos = getDateBetween(mindate, min)
      var newDateArr = rawArr.slice(startPos, startPos + d + 1)
      var newArr = ranArr.slice(startPos, startPos + d + 1)
      var echarts = require('echarts')
      var myChart = document.getElementById('myChart')
      var mainChart = echarts.init(myChart)
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
          name: '销量',
          type: 'line',
          smooth: true,
          data: newArr
        }]
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sampleButton{
  margin:0 auto
}
</style>
