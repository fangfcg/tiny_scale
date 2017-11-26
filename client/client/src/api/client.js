import io from 'socket.io-client'
var msgId = 0
var serverAddress = 'http://183.172.152.40:8081'

var Chat = {
  msgList: [],
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
  initSock () {
    this.socket = io(serverAddress)
    this.socket.on('service_response', function (data) {
      var sysmsg = Chat.createMsg()
      sysmsg.type = 2
      if (data === false) {
        Chat.status = 0
        sysmsg.msg = '请求客服失败，请重试'
        Chat.msgList.push(sysmsg)
      }
    })
    this.socket.on('operator_connected', function () {
      Chat.status = 2
      var sysmsg = Chat.createMsg()
      sysmsg.msg = '已接入客服，正在为您服务'
      sysmsg.type = 2
      Chat.msgList.push(sysmsg)
    })
    this.socket.on('msg', function (inputMsgObj) {
      var operatorMsg = Chat.createMsg()
      operatorMsg.msg = inputMsgObj.msg
      operatorMsg.type = 1
      Chat.msgList.push(operatorMsg)
    })
    this.socket.on('operator_disconnected', function () {
      Chat.status = 0
      var sysmsg = Chat.createMsg()
      sysmsg.msg = '客服已断开连接'
      sysmsg.type = 2
      Chat.msgList.push(sysmsg)
    })
    this.socket.on('crash', function () {
      Chat.status = 0
      var sysmsg = Chat.createMsg()
      sysmsg.msg = '因为一些意外的错误，客服断开了连接，请稍等'
      sysmsg.type = 2
      Chat.msgList.push(sysmsg)
    })
  },
  callService () {
    var msgObj = this.createMsg()
    if (this.status === 0) {
      this.socket.emit('service_request')
      this.status = 1
      msgObj.msg = '正在为您分配客服，请稍候'
      msgObj.type = 2
      this.msgList.push(msgObj)
    } else if (this.status === 1) {
      msgObj.msg = '正在为您分配客服，请稍候'
      msgObj.type = 2
      this.msgList.push(msgObj)
    } else {
      msgObj.msg = '客服正在为您服务'
      msgObj.type = 2
      this.msgList.push(msgObj)
    }
  },
  sendMsg (newMsg) {
    var msgObj = Chat.createMsg()
    msgObj.name = Chat.userName
    msgObj.msg = newMsg
    msgObj.type = 0
    this.msgList.push(msgObj)
    if (this.status === 2) {
      this.socket.emit('msg', {msg: newMsg})
    }
  }
}

export default Chat
