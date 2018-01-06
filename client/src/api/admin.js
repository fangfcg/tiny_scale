// import {urlAdmin, serverIp} from '../../configs'
import {serverIp} from '../../configs'
const axios = require('axios')
axios.defaults.withCredentials = true
const httpUrl = {
  postUrl: '/login',
  groupInfoUrl: '/api/admin/group_info', // get方法，参数为1.id，即admin的id 2.dataType 为null则获取客服名称与id的列表。不为null则获取对应数据
  operatorInfoUrl: '/api/admin/operator_info', // get方法，参数为 1.某个特定的客服的id 2.dataType
  operatorChatTotalUrl: '/api/admin/operator_chat_total', // get方法，参数为某个特定客服的id
  operatorChatLogUrl: '/api/admin/operator_chat_log' // 参数为ChatHistory的id和时间(还没想好)
}
const dataTypeList = ['sessionCount', 'manualRate', 'messageCount', 'satisfiedRate', 'commentRate', 'qaRate', 'responseTime']
var adminobj = {
  adminId: null,
  choosenOperator: {id: null, name: null},  // {id: x, name: 'a'}
  choosenDataType: null,
  startDate: null,
  endDate: null,
  serverIp: serverIp,
  data: [],
  token: null,
  imgUrl: null,
  name: '小明',
  email: '123@123.com',
  operatorList: [], // [{id: 1, name: 'abc'}],
  getGroupList () {
    // adminobj.operatorList = [{name: 'hello', id: 1}, {name: 'hi', id: 2}]
    axios.post(this.serverIp + httpUrl.postUrl, {
      username: 'fcg',
      password: '123456',
      type: 'admin'
    }).then(function () {
      axios.get(adminobj.serverIp + httpUrl.groupInfoUrl, {
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
    axios.get(this.serverIp + httpUrl.groupInfoUrl, {
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
    axios.get(this.serverIp + httpUrl.operatorInfoUrl, {
      params: {
        id: adminobj.choosenOperator.id,
        dataType: dataTypeList[adminobj.choosenDataType]
      }
    })
    .then(function (response) {
      adminobj.data = response.data.data
      adminobj.startDate = new Date(response.data.startDate)
      adminobj.endDate = new Date(response.data.endDate)
    })
  },
  getOperatorChatTotal () {
    axios.get(this.serverIp + httpUrl.operatorChatTotalUrl, {
      params: {
        id: adminobj.choosenOperator.id
      }
    })
    .then(function (response) {
      adminobj.data = response.data
    })
  },
  getOperatorChatLog () {
    axios.get(this.serverIp + httpUrl.operatorChatTotalUrl, {
      params: {
        id: adminobj.choosenOperator.id
      }
    })
    .then(function (response) {
      adminobj.data = response.data
    })
  },
  initData () {
    axios.get(this.serverIp + '/api/get_profile').then(function (response) {
      adminobj.name = response.name
      adminobj.email = response.email
      adminobj.imgUrl = adminobj.serverIp + '/' + response.imgUrl
    })
  }
}

export default adminobj
