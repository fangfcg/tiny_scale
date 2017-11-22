import io from 'socket.io-client'
var msgId = 0
// below are some msg content for test.
var msgType = [2, 0, 1, 0, 1]
var msgName = ['fcg', 'a', 'fcg', 'a', 'fcg']
var msgContent = ['fcg为您服务', 'hello', '1', '2', 'hello']
var serverAddress = 'http://localhost:8081'

var Chat = {
  msgList: [],
  userName: 1,
  userId: null,
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
      if (data === 0) {
        console.log(1)
      }
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
