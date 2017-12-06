import io from 'socket.io-client'
import {urlOperator} from '../../configs'
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
  userList: [{ userid: 1, msgList: [] }],
  socket: null,
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
    console.log('operator')
    console.log(userid)

    for (var j = 0; j < this.currentNum; j++) {
      if (this.userList[j].userid === userid) {
        this.currentUser = userid
        this.currentIndex = j
      }
    }
    console.log('index')
    console.log(this.currentIndex)
  },
  initSock: function () {
    this.socket = io(serverAddress)
    this.socket.on('new_customer', function () {
      console.log(1231232132131231)
      this.waitingNum ++
    }.bind(Chat))
    this.socket.on('get_next', function (userid) {
      console.log('aaaa')
      console.log(userid)
      console.log('bbbb')
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
    console.log(123)
    this.socket.emit('get_next')
  },
  sendMsg: function (msg) {
    var newMsg = this.createMsg()
    newMsg.msg = msg
    newMsg.type = 0
    this.userList[this.currentIndex].msgList.push(newMsg)
    this.socket.emit('msg', this.currentUser, {msg: msg})
  }
}

export default Chat
