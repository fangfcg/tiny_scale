import io from 'socket.io-client'
var msgId = 0
// below are some msg content for test.
var msgType = [2, 0, 1, 0, 1]
var msgName = ['fcg', 'a', 'fcg', 'a', 'fcg']
var msgContent = ['欢迎使用客服系统', 'hello', '1', '2', 'hello']
var serverAddress = 'http://localhost:8081'

var Chat = {
  msgList: [],
  // userName: 1,
  // userId: null,
  socket: null,
  status: 0, // 0: not call. 1: calling, 2: serving
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
    this.socket.on('service_response', function (data) {
      var sysmsg = this.createMsg()
      sysmsg.type = 2
      if (data === false) {
        this.status = 0
        sysmsg.msg = '请求客服失败，请重试'
      } else {
        this.status = 1
        sysmsg.msg = '已收到消息，即将为您分配客服'
      }
      this.msgList.push(sysmsg)
    })
    this.socket.on('operator_connected', function () {
      this.status = 2
      var sysmsg = this.createMsg()
      sysmsg.msg = '已接入客服，正在为您服务'
      sysmsg.type = 2
      this.msgList.push(sysmsg)
    })
    this.socket.on('msg', function (inputMsgObj) {
      var operatorMsg = this.createMsg()
      operatorMsg.msg = inputMsgObj.msg
      operatorMsg.type = 1
      this.msgList.push(operatorMsg)
    })
    this.socket.on('operator_disconnected', function () {
      this.status = 0
      var sysmsg = this.createMsg()
      sysmsg.msg = '客服已断开连接'
      sysmsg.type = 2
      this.msgList.push(sysmsg)
    })
    this.socket.on('crash', function () {
      this.status = 0
      var sysmsg = this.createMsg()
      sysmsg.msg = '因为一些意外的错误，客服断开了连接，请稍等'
      sysmsg.type = 2
      this.msgList.push(sysmsg)
    })
  }
}

for (var i = 0; i < 5; i++) {
  var msg = Chat.createMsg()
  msg.type = msgType[i]
  msg.name = msgName[i]
  msg.msg = msgContent[i]
  Chat.msgList.push(msg)
}

export default Chat
