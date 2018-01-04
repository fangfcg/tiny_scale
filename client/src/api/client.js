import io from 'socket.io-client'
import {urlClient, clientToken, serverIp} from '../../configs'
const axios = require('axios')
axios.defaults.withCredentials = true
let msgId = 0
let serverAddress = urlClient
let Chat = {
  msgList: [{
    type: 1,
    isPicture: false,
    msg: '123',
    name: null,
    key: 0,
    imgUrl: null,
    time: Date.now()
  },
  {
    type: 0,
    isPicture: false,
    msg: '123',
    name: null,
    key: 0,
    imgUrl: null,
    time: Date.now()
  }],
  socket: null,
  imgUrl: null,
  robotUrl: null,
  operatorName: null,
  serverIp: serverIp,
  status: 0, // 0: not call. 1: calling, 2: serving 3:leavingMessage 4:rating
  createMsg: function () {
    msgId++
    return {
      type: 0, // 0: self 1: other 2: system
      isPicture: false,
      msg: null,
      name: null,
      key: msgId,
      time: Date.now()
    }
  },
  async initSock () {
    var session
    let res = await axios.get(urlClient + '/api/get_session_id')
    let response = res.data
    session = response.session

    this.socket = io(serverAddress, {
      query: {
        session: session,
        token: clientToken,
        type: 'client'
      }
    })
    this.socket.on('message_answered', function (data) {
      let sysmsg = Chat.createMsg()
      sysmsg.type = 2
      sysmsg.msg = '您的请求已经被成功受理，下面是您的问题和客服人员对应的答案'
      Chat.msgList.push(sysmsg)
      let selfmsg = Chat.createMsg()
      selfmsg.type = 0
      selfmsg.msg = data.conent
      Chat.msgList.push(selfmsg)
      let othermsg = Chat.createMsg()
      othermsg.type = 1
      othermsg.msg = data.answer
      Chat.msgList.push(othermsg)
    })
    this.socket.on('service_response', function (data) {
      let sysmsg = Chat.createMsg()
      sysmsg.type = 2
      if (!data.allocated) {
        Chat.status = 3
        sysmsg.msg = '请求客服失败，如需重试，请刷新；您现在可以留言，直接在下方编辑点击留言发送即可'
        Chat.msgList.push(sysmsg)
      } else {
        Chat.imgUrl = data.portrait
        Chat.operatorName = data.name
      }
    })
    this.socket.on('operator_connected', function () {
      Chat.status = 2
      let sysmsg = Chat.createMsg()
      sysmsg.msg = '客服' + Chat.operatorName + '正在为您服务'
      sysmsg.type = 2
      Chat.msgList.push(sysmsg)
    })
    this.socket.on('msg', function (inputMsgObj) {
      let operatorMsg = Chat.createMsg()
      operatorMsg.msg = inputMsgObj.msg
      operatorMsg.type = 1
      if (Chat.status === 2) {
        operatorMsg.imgUrl = Chat.imgUrl
      } else {
        operatorMsg.imgUrl = Chat.robotUrl
      }
      Chat.msgList.push(operatorMsg)
    })
    this.socket.on('operator_disconnected', function () {
      Chat.status = 4
      let sysmsg = Chat.createMsg()
      sysmsg.msg = '客服已断开连接，现在您可以对客服的表现进行评分'
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
    } else if (this.status === 4) {
      msgObj.msg = '您正在评分，请评分完毕之后再申请客服'
      msgObj.type = 2
      this.msgList.push(msgObj)
    }
  },
  sendMsg (newMsg) {
    if (this.status === 3 || this.status === 4) {
      let msgObj = Chat.createMsg()
      if (this.status === 3) {
        msgObj.msg = '您正在留言，请留言完毕之后再发送信息'
      } else {
        msgObj.msg = '您正在评分，请评分完毕之后再发送信息'
      }
      msgObj.type = 2
      this.msgList.push(msgObj)
    } else {
      let msgObj = Chat.createMsg()
      msgObj.name = Chat.userName
      msgObj.msg = newMsg
      msgObj.type = 0
      this.msgList.push(msgObj)
      this.socket.emit('msg', {msg: newMsg, time: msgObj.time})
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
      this.socket.emit('leave_msg', newMsg)
      this.status = 0 // set the status to the regular status
    } else {
      sysObj.type = 2
      sysObj.msg = '您现在不能进行留言'
      this.msgList.push(sysObj)
    }
  },
  sendRate (rate) {
    let sysObj = this.createMsg()
    sysObj.type = 2
    if (this.status !== 4) {
      sysObj.msg = '发生未知错误，现在返回至初始状态'
      this.msgList.push(sysObj)
      this.status = 0
    } else {
      this.socket.emit('comment', rate)
      sysObj.msg = '评分成功,评分为' + rate + '分'
      this.msgList.push(sysObj)
      this.status = 0
    }
  }
}

export default Chat
