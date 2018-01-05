import io from 'socket.io-client'
import {urlOperator, serverIp} from '../../configs'
const axios = require('axios')
axios.defaults.withCredentials = true
const httpUrl = {
  leaveMsgUrl: '/api/operator/get_left_msg_lst',
  getLeaveMsgUrl: '/api/operator/get_left_msg',
  replyMsgUrl: '/api/operator/answer_msg',
  getSelfQuickReplyUrl: '/api/operator/get_selfreply',
  getCompQuickReplyUrl: '/api/operator/get_compreply',
  setQuickReplyUrl: '/api/operator/set_quickreply'
}

var msgId = 0
// below are some msg content for test.
var serverAddress = urlOperator
var user = function () {
  return {
    userid: null,
    msgList: []
  }
}
var Chat = {
  currentUser: null,
  currentIndex: null,
  waitingNum: 0,
  currentNum: 0,
  finishNum: 0,
  operatorStatus: 0,
  imgUrl: null,
  userList: [],
  socket: null,
  serverIp: serverIp,
  crashFlag: false,
  newCrossServe: false,
  name: '小明',
  email: '123@123.com',
  selfData: [],
  compData: [],
  leaveMsgList: [{
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
  }],
  isReplying: false,
  replyingId: 0,
  replyingMsg: '',
  createMsg: function () {
    msgId++
    return {
      type: 0, // 0: self 1: other 2: system
      msg: null,
      name: null,
      key: msgId,
      isPicture: false,
      time: Date.now()
    }
  },
  changeCard: function (userid) {
    for (var j = 0; j < this.currentNum; j++) {
      if (this.userList[j].userid === userid) {
        this.currentUser = userid
        this.currentIndex = j
      }
    }
  },
  initSock: async function () {
    var session
    let res = await axios.get(serverIp + `/api/get_session_id/${Date.now()}`)
    let response = res.data
    session = response.session
    this.socket = io(serverAddress, {
      query: {
        session: session,
        type: 'operator'
      }
    })
    this.socket.on('new_customer', function () {
      this.waitingNum ++
    }.bind(Chat))
    this.socket.on('get_next', function (obj) {
      if (!obj.success) {
        this.waitingNum = 0
        return
      }
      var userid = obj.id
      var newUser = user()
      this.newCrossServe = false
      newUser.userid = userid
      this.currentUser = userid
      this.userList.push(newUser)
      this.currentNum ++
      this.waitingNum --
      this.currentIndex = this.currentNum - 1
    }.bind(Chat))
    this.socket.on('msg', function (customId, inputMsg) {
      var clientMsg = this.createMsg()
      clientMsg.msg = inputMsg.msg
      clientMsg.isPicture = inputMsg.isPic
      clientMsg.type = 1
      for (var j = 0; j < this.currentNum; j++) {
        if (this.userList[j].userid === customId) {
          this.userList[j].msgList.push(clientMsg)
        }
      }
    }.bind(Chat))
    this.socket.on('crash', function (userid) {
      if (userid === this.currentUser) {
        this.currentNum --
        this.finishNum ++
        this.userList.splice(this.currentIndex, 1)
        this.crashFlag = true
        if (this.currentNum === 0) {
          this.currentIndex = null
          this.currentUser = null
        } else {
          this.currentIndex = 0
          this.currentUser = this.userList[0].userid
        }
      } else {
        for (var t = 0; t < this.currentNum; t++) {
          if (this.userList[t].userid === userid) {
            this.userList.splice(t, 1)
            if (this.currentIndex > t) {
              this.currentIndex --
            }
            break
          }
        }
      }
    }.bind(Chat))
    this.socket.on('cross_serve', function (userid, chatId) {
      var newUser = user()
      newUser.userid = userid
      this.userList.push(newUser)
      this.currentNum ++
      this.newCrossServe = true
    }.bind(Chat))
  },
  endService: function () {
    if (this.currentNum <= 0) {
      return
    }
    this.socket.emit('end_service', this.currentUser)
    this.crashFlag = false
    this.currentNum --
    this.finishNum ++
    this.userList.splice(this.currentIndex, 1)
    if (this.currentNum === 0) {
      this.currentIndex = null
      this.currentUser = null
    } else {
      this.currentIndex = 0
      this.currentUser = this.userList[0].userid
    }
  },
  getNext: function () {
    this.socket.emit('get_next')
  },
  sendMsg: function (payload) {
    if (this.currentUser === null) {
      return
    }
    var newMsg = this.createMsg()
    newMsg.msg = payload.msg
    newMsg.type = 0
    newMsg.isPicture = payload.isPic
    this.userList[this.currentIndex].msgList.push(newMsg)
    this.socket.emit('msg', this.currentUser, {msg: payload.msg, isPic: payload.isPic, time: newMsg.time})
  },
  changeStatus (command) {
    this.socket.emit('change_state', command)
  },
  crossServe (operatorId) {
    this.socket.emit('cross_serve', this.currentUser, operatorId)
    this.currentNum --
    this.userList.splice(this.currentIndex, 1)
    if (this.currentNum === 0) {
      this.currentIndex = null
      this.currentUser = null
    } else {
      this.currentIndex = 0
      this.currentUser = this.userList[0].userid
    }
  },
  async getLeaveMessageList () {
    var response = await axios.get(this.serverIp + httpUrl.leaveMsgUrl)
    console.log('Successed')
    console.log(response)
    if (response.data.success === true) {
      Chat.leaveMsgList = response.data.msg
      Chat.isReplying = false
      Chat.replyingId = -1
      Chat.replyingMsg = ''
    } else {
      Chat.leaveMsgList = []
      Chat.isReplying = true
      Chat.replyingId = response.data.msg.id
      Chat.replyingMsg = response.data.msg.content
    }
  },
  async customGetLeaveMsg (msgId) {
    // console.log('into the funciton')
    // console.log(msgId)
    var response = await axios.post(this.serverIp + httpUrl.getLeaveMsgUrl, {id: msgId})
    if (response.data.success === true) {
      Chat.isReplying = true
      Chat.replyingId = msgId
      Chat.replyingMsg = response.data.msg.content
      // console.log('true')
    } else {
      Chat.isReplying = false
      Chat.replyingId = -1
      Chat.replyingMsg = ''
      // console.log('false')
    }
  },
  async customReplyMsg (msg) {
    var response = await axios.post(this.serverIp + httpUrl.replyMsgUrl, {answer: msg})
    if (response.data.success === true) {
      Chat.isReplying = false
      Chat.replyingMsg = ''
      return true
    } else {
      return false
    }
  },
  async getSelfReply () {
    var response = await axios.get(this.serverIp + httpUrl.getSelfQuickReplyUrl)
    this.selfData = response.data.data
    console.log(this.selfData)
    console.log('in getSelfReply')
    /*
    .then(function (response) {
      Chat.selfData = response.data.data
    })
    */
  },
  async getCompReply () {
    axios.get(this.serverIp + httpUrl.getCompQuickReplyUrl).then(function (response) {
      Chat.compData = response.data.data
    })
  },
  renewReply () {
    axios.post(this.serverIp + httpUrl.setQuickReplyUrl, {
      data: Chat.selfData
    }).then(function (response) {
      if (response.data.success === true) {
        return true
      } else {
        return false
      }
    })
  },
  initData () {
    axios.get(this.serverIp + '/api/get_profile').then(function (response) {
      Chat.name = response.data.name
      Chat.email = response.data.email
      Chat.imgUrl = this.serverIp + '/' + response.data.imgUrl
    })
  }
}

export default Chat
