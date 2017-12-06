
var Admin = {
  // 信息数据部分
  typeList: ['会话量', '人工接入率', '消息数', '满意度', '参评率', '问答比', '平均响应时间'],
  CustomList: ['总体', '客服1', '客服2'],
  dateStart: '2017-12-1',
  dateEnd: '2017-12-15',
  data: [[[], [], []], [[], [], []], [[], [], []], [[], [], []], [[], [], []], [[], [], []], [[], [], []]],
  currDisplayingType: -1,
  currDisplayingCustom: 0,
  changeDisplayingType: function (id) {
    this.currDisplayingType = id
    this.currDisplayingCustom = 0
  },
  changeDisplayingCustom: function (id) {
    this.currDisplayingCustom = id
  },
  getRawData: function () {
    return this.data[this.currDisplayingType][this.changeDisplayingCustom]
  },
  setRandomData: function () {
    for (var i = 0; i < 7; i++) {
      for (var j = 0; j < 3; j++) {
        for (var k = 0; k < 15; k++) {
          this.data[i][j].push(parseInt(Math.random() * 20 + 5, 10))
        }
      }
    }
  },
  getCurrType: function () {
    return this.typeList[this.changeDisplayingType]
  }
  // 个人属性部分
}

export default Admin
