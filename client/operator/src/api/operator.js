import io from 'socket.io-client'
var msgId = 0
// below are some msg content for test.
var serverAddress = 'http://localhost:8081'
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
  userList: [],
  // userName: 1,
  // userId: null,
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
  initSock: function () {
    this.socket = io(serverAddress)
    this.socket.on('new_customer', function () {
      this.waitingNum ++
    })
    this.socket.on('get_next', function (userid) {
      var newUser = user()
      this.currentUser = userid
      newUser.userid = userid
      this.currentNum ++
      this.waitingNum --
      this.currentIndex = this.currentNum - 1
    })
    this.socket.on('msg', function (inputMsg) {
      var clientMsg = this.createMsg()
      clientMsg.msg = inputMsg
      clientMsg.type = 1
      this.userList[this.currentIndex].msgList.push(clientMsg)
    })
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
    })
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
    var newMsg = this.createMsg()
    newMsg.msg = msg
    newMsg.type = 0
    this.userList[this.currentIndex].msgList.push(newMsg)
    this.socket.emit()
  }
}

export default Chat
