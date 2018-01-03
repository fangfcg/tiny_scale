import io from 'socket.io-client'
import {urlClient, clientToken} from '../../configs'
const axios = require('axios')
let msgId = 0
let serverAddress = urlClient
let Chat = {
  msgList: [],
  socket: null,
  imgUrl: null,
  status: 0, // 0: not call. 1: calling, 2: serving 3:leavingMessage
  createMsg: function () {
    msgId++
    return {
      type: 0, // 0: self 1: other 2: system
      msg: null,
      name: null,
      key: msgId,
      time: Date.now()
    }
  },
  initSock () {
    var session
    axios.get(urlClient + '/api/get_session_id').then(function (response) {
      session = response.session
    })
    this.socket = io(serverAddress, {
      query: {
        session: session,
        token: clientToken,
        type: 'client'
      }
    })
    this.socket.on('service_response', function (data) {
      let sysmsg = Chat.createMsg()
      sysmsg.type = 2
      if (data === false) {
        Chat.status = 3
        sysmsg.msg = '请求客服失败，如需重试，请刷新；您现在可以留言，直接在下方编辑点击留言发送即可'
        Chat.msgList.push(sysmsg)
      }
    })
    this.socket.on('operator_connected', function () {
      Chat.status = 2
      let sysmsg = Chat.createMsg()
      sysmsg.msg = '已接入客服，正在为您服务'
      sysmsg.type = 2
      Chat.msgList.push(sysmsg)
    })
    this.socket.on('msg', function (inputMsgObj) {
      let operatorMsg = Chat.createMsg()
      operatorMsg.msg = inputMsgObj.msg
      operatorMsg.type = 1
      Chat.msgList.push(operatorMsg)
    })
    this.socket.on('operator_disconnected', function () {
      Chat.status = 0
      let sysmsg = Chat.createMsg()
      sysmsg.msg = '客服已断开连接'
      sysmsg.type = 2
      Chat.msgList.push(sysmsg)
    })
    this.socket.on('cross_serve', function () {
      let sysmsg = Chat.createMsg()
      sysmsg.msg = '客服已转接'
      sysmsg.type = 2
      Chat.msgList.push(sysmsg)
    })
    this.socket.on('crash', function () {
      Chat.status = 0
      let sysmsg = Chat.createMsg()
      sysmsg.msg = '因为一些意外的错误，客服断开了连接，请稍等'
      sysmsg.type = 2
      Chat.msgList.push(sysmsg)
    })
  },
  callService () {
    let msgObj = this.createMsg()
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
    } else if (this.status === 2) {
      msgObj.msg = '客服正在为您服务'
      msgObj.type = 2
      this.msgList.push(msgObj)
    } else if (this.status === 3) {
      msgObj.msg = '您正在留言，请留言完毕之后再申请客服'
      msgObj.type = 2
      this.msgList.push(msgObj)
    }
  },
  sendMsg (newMsg) {
    if (this.status === 3) {
      let msgObj = Chat.createMsg()
      msgObj.msg = '您正在留言，请留言完毕之后再发送信息'
      msgObj.type = 2
      this.msgList.push(msgObj)
    } else {
      let msgObj = Chat.createMsg()
      msgObj.name = Chat.userName
      msgObj.msg = newMsg
      msgObj.type = 0
      this.msgList.push(msgObj)
      if (this.status === 2) {
        this.socket.emit('msg', {msg: newMsg, time: msgObj.time})
      }
    }
  },
  leaveMsg (newMsg) {
    let sysObj = this.createMsg()
    if (this.status === 3) {
      sysObj.type = 2
      sysObj.msg = '留言成功,返回正常状态'
      this.msgList.push(sysObj)
      let msgObj = Chat.createMsg()
      msgObj.name = Chat.userName
      msgObj.msg = newMsg
      msgObj.type = 0
      this.msgList.push(msgObj)
      this.socket.emit('leaveMsg', {leaveMessage: newMsg})
      this.status = 0 // set the status to the regular status
    } else {
      sysObj.type = 2
      sysObj.msg = '您现在不能进行留言'
      this.msgList.push(sysObj)
    }
  }
}

export default Chat
