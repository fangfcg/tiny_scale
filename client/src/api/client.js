import io from 'socket.io-client'
import {urlClient, clientToken, serverIp} from '../../configs'
const axios = require('axios')
axios.defaults.withCredentials = true
let msgId = 0
let serverAddress = urlClient
let Chat = {
  msgList: [],
  socket: null,
  imgUrl: null,
  robotUrl: '/static/robot.jpg',
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
    let res = await axios.get(urlClient + `/api/get_session_id/${Date.now()}`)
    let response = res.data
    session = response.session

    this.socket = io(serverAddress, {
      query: {
        session: session,
        token: clientToken,
        type: 'client'
      }
    })
    this.socket.on('msg_left', function (data) {
      let sysmsg = Chat.createMsg()
      sysmsg.type = 2
      // console.log('123')
      // console.log(sysmsg)
      if (data.success === true) {
        sysmsg.msg = '留言成功'
        Chat.msgList.push(sysmsg)
        // console.log('234')
      } else {
        sysmsg.msg = '出现了奇怪的错误导致留言失败，我们会尽快处理！'
        Chat.msgList.push(sysmsg)
        // console.log('345')
      }
    })
    this.socket.on('message_answered', function (data) {
      console.log(data)
      let sysmsg = Chat.createMsg()
      sysmsg.type = 2
      sysmsg.msg = '您的请求已经被客服' + data.name + '受理，下面是您的问题和客服人员对应的答案'
      Chat.msgList.push(sysmsg)
      let selfmsg = Chat.createMsg()
      selfmsg.type = 0
      selfmsg.msg = data.content
      Chat.msgList.push(selfmsg)
      let othermsg = Chat.createMsg()
      othermsg.type = 1
      othermsg.msg = data.answer
      othermsg.imgUrl = Chat.serverIp + '/' + data.imgUrl
      Chat.msgList.push(othermsg)
    })
    this.socket.on('service_response', function (data) {
      let sysmsg = Chat.createMsg()
      sysmsg.type = 2
      console.log(data)
      if (!data.allocated) {
        Chat.status = 3
        sysmsg.msg = '没有客服在线诶，请留言，我们会尽快处理哒^_^'
        Chat.msgList.push(sysmsg)
      } else {
        Chat.imgUrl = Chat.serverIp + '/' + data.portrait
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
      console.log(inputMsgObj)
      let operatorMsg = Chat.createMsg()
      operatorMsg.msg = inputMsgObj.msg
      operatorMsg.type = 1
      operatorMsg.isPicture = inputMsgObj.isPic
      if (Chat.status === 2) {
        console.log(Chat.imgUrl)
        operatorMsg.imgUrl = Chat.imgUrl
      } else {
        operatorMsg.imgUrl = Chat.robotUrl
      }
      Chat.msgList.push(operatorMsg)
    })
    this.socket.on('operator_disconnected', function () {
      Chat.status = 4
      let sysmsg = Chat.createMsg()
      sysmsg.msg = '客服结束了服务，欢迎您的评价哦亲~'
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
      sysmsg.msg = '因为一些意外的错误，客服的连接中断了，请重试T_T'
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
      msgObj.msg = '拜托先写一下留言哦亲~'
      msgObj.type = 2
      this.msgList.push(msgObj)
    } else if (this.status === 4) {
      msgObj.msg = '麻烦先评个分嘛亲~'
      msgObj.type = 2
      this.msgList.push(msgObj)
    }
  },
  sendMsg (payload) {
    console.log(payload)
    if (this.status === 3 || this.status === 4) {
      let msgObj = Chat.createMsg()
      if (this.status === 3) {
        msgObj.msg = '拜托先写一下留言哦亲~'
      } else {
        msgObj.msg = '麻烦先评个分嘛亲~'
      }
      msgObj.type = 2
      this.msgList.push(msgObj)
    } else {
      let msgObj = Chat.createMsg()
      msgObj.name = Chat.userName
      msgObj.msg = payload.msg
      msgObj.type = 0
      msgObj.isPicture = payload.isPic
      console.log(msgObj)
      this.msgList.push(msgObj)
      this.socket.emit('msg', {msg: payload.msg, isPic: payload.isPic, time: msgObj.time})
    }
  },
  leaveMsg (newMsg) {
    if (this.status === 3) {
      let msgObj = Chat.createMsg()
      msgObj.name = Chat.userName
      msgObj.msg = newMsg
      msgObj.type = 0
      this.msgList.push(msgObj)
      this.socket.emit('leave_msg', newMsg)
      this.status = 0 // set the status to the regular status
    } else {
      let sysObj = this.createMsg()
      sysObj.type = 2
      sysObj.msg = '先试试请求人工客服哦^_^'
      this.msgList.push(sysObj)
    }
  },
  sendRate (rate) {
    let sysObj = this.createMsg()
    sysObj.type = 2
    if (this.status !== 4) {
      this.msgList.push(sysObj)
      this.status = 0
    } else {
      this.socket.emit('comment', rate)
      this.msgList.push(sysObj)
      this.status = 0
    }
  }
}

export default Chat
