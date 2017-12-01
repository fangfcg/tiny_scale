import io from 'socket.io-client'
var msgId = 0
// below are some msg content for test.
// var msgType = [2, 0, 1, 0, 1]
// var msgName = ['fcg', 'a', 'fcg', 'a', 'fcg']
// var msgContent = ['欢迎使用客服系统', 'hello', '1', '2', 'hello']
var serverAddress = 'http://183.172.152.40:8081'

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
      console.log(this)
      var sysmsg = this.createMsg()
      console.log(44444)
      sysmsg.type = 2
      if (data === false) {
        this.status = 0
        sysmsg.msg = '请求客服失败，请重试'
        this.msgList.push(sysmsg)
      } // else {
        // this.status = 1
        // sysmsg.msg = '已收到消息，即将为您分配客服'
        // this.msgList.push(sysmsg)
      // }
    }.bind(Chat))
    this.socket.on('operator_connected', function () {
      this.status = 2
      var sysmsg = this.createMsg()
      sysmsg.msg = '已接入客服，正在为您服务'
      sysmsg.type = 2
      this.msgList.push(sysmsg)
    }.bind(Chat))
    this.socket.on('msg', function (inputMsgObj) {
      var operatorMsg = this.createMsg()
      operatorMsg.msg = inputMsgObj.msg
      operatorMsg.type = 1
      this.msgList.push(operatorMsg)
    }.bind(Chat))
    this.socket.on('operator_disconnected', function () {
      this.status = 0
      var sysmsg = this.createMsg()
      sysmsg.msg = '客服已断开连接'
      sysmsg.type = 2
      this.msgList.push(sysmsg)
    }.bind(Chat))
    this.socket.on('crash', function () {
      this.status = 0
      var sysmsg = this.createMsg()
      sysmsg.msg = '因为一些意外的错误，客服断开了连接，请稍等'
      sysmsg.type = 2
      this.msgList.push(sysmsg)
    }.bind(Chat))
  }
}

export default Chat
