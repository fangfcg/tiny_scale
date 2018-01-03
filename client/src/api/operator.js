import io from 'socket.io-client'
import {urlOperator, serverIp} from '../../configs'
const axios = require('axios')
const httpUrl = {
  leaveMsgUrl: '/api/client/leave_message', // get方法，参数为1.id，即admin的id 2.dataType 为null则获取客服名称与id的列表。不为null则获取对应数据
  getLeaveMsgUrl: '/api/client/get_leavemsg',
  leaveMsgResultUrl: '/api/client/leavemsg_res'
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
  userList: [],
  socket: null,
  serverIp: serverIp,
  name: '小明',
  email: '123@123.com',
  leaveMsgList: [],
  isReplying: false,
  replyingMsg: '',
  createMsg: function () {
    msgId++
    return {
      type: 0, // 0: self 1: other 2: system
      msg: null,
      name: null,
      color: null,
      key: msgId
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
  initSock: function () {
    this.socket = io(serverAddress)
    this.socket.on('new_customer', function () {
      this.waitingNum ++
    }.bind(Chat))
    this.socket.on('get_next', function (userid) {
      var newUser = user()
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
  },
  endService: function () {
    if (this.currentNum <= 0) {
      return
    }
    this.socket.emit('end_service', this.currentUser)
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
  sendMsg: function (msg) {
    if (this.currentUser === null) {
      return
    }
    var newMsg = this.createMsg()
    newMsg.msg = msg
    newMsg.type = 0
    this.userList[this.currentIndex].msgList.push(newMsg)
    this.socket.emit('msg', this.currentUser, {msg: msg})
  },
  getLeaveMessageList () {
    axios.get(httpUrl.leaveMsgUrl).then(function (response) {
      Chat.leaveMsgList = response.data.data
      Chat.isReplying = response.data.isReplying
      Chat.replyingMsg = response.data.replyingMsg
    })
  },
  customGetLeaveMsg (msgId) {
    axios.post(httpUrl.getLeaveMsgUrl, {
      id: msgId,
      type: 'custom'
    }).then(function (response) {
      if (response.success === true) {
        Chat.isReplying = true
        Chat.replyingMsg = response.data.replyingMsg
      } else {
        Chat.isReplying = false
      }
    })
  },
  customReplyMsg (msg) {
    axios.post(httpUrl.replyMsgUrl, {
      msg: msg,
      type: 'custom'
    }).then(function (response) {
      if (response.success === true) {
        Chat.isReplying = false
        Chat.replyingMsg = ''
        return true
      } else {
        return false
      }
    })
  }
}

export default Chat
