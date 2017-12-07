// import {urlOperator} from '../../configs'
const axios = require('axios')
const httpUrl = {
  postUrl: '/login',
  groupInfoUrl: '/api/admin/group_info', // get方法，参数为1.id，即admin的id 2.dataType 为null则获取客服名称与id的列表。不为null则获取对应数据
  operatorInfoUrl: '/api/admin/operator_info', // get方法，参数为 1.某个特定的客服的id 2.dataType
  operatorChatTotalUrl: '/api/admin/operator_chat_total', // get方法，参数为某个特定客服的id
  operatorChatLogUrl: '/api/admin/operator_chat_log' // 参数为ChatHistory的id和时间(还没想好)
}
const dataTypeList = ['sessionCount', 'manualRate', 'messageCount', 'satRate', 'commentRate', 'qaRate', 'avaResponseTime']
var adminobj = {
  adminId: null,
  choosenOperator: {id: null, name: null},  // {id: x, name: 'a'}
  choosenDataType: null,
  startDate: null,
  endDate: null,
  data: [],
  operatorList: [], // [{id: 1, name: 'abc'}],
  getGroupList () {
    axios.post(httpUrl.postUrl, {
      username: 'fcg',
      password: '123456',
      type: 'admin'
    }).then(function () {
      axios.get(httpUrl.groupInfoUrl, {
        params: {
          id: adminobj.adminId,
          dataType: null
        }
      })
      .then(function (response) {
        adminobj.operatorList = response.data
      })
    })
  },
  getGroupInfo () {
    axios.get(httpUrl.groupInfoUrl, {
      params: {
        id: adminobj.adminId,
        dataType: dataTypeList[adminobj.choosenDataType]
      }
    })
    .then(function (response) {
      adminobj.data = response.data.data
      adminobj.startDate = new Date(response.data.startDate)
      adminobj.endDate = new Date(response.data.endDate)
    })
  },
  getOperatorInfo () {
  },
  getOperatorChatTotal () {
  },
  getOperatorChatLog () {
  }
}

export default adminobj
