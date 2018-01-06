const robot = require('../../api/robot');
const chatLogger = require('../chatLogger');
const util = require('../../utils');
const model = require('../../models/models').models;
const SERVING_STATUS_ROBOT = 0;
const SERVING_STATUS_WAITING = 1;
const SERVING_STATUS_CHATTING = 2;
const SERVING_STATUS_COMMENTING = 3;
class customerController {
    constructor() {
        this.customerAccepted = 0;
        this.event = new (require('events'))();
        this.socketPool = {};       //socket池以用户的id作为索引
    }
    operatorEventHandler(operatorEvent) {
        operatorEvent.on('operator_allocated', this._operatorAllocated.bind(this));
        operatorEvent.on('operator_connected', this._operatorConnected.bind(this));
        operatorEvent.on('msg', this._operatorMsg.bind(this));
        operatorEvent.on('end_service', this._endService.bind(this));
        operatorEvent.on('crash', this._crash.bind(this));
        operatorEvent.on('cross_serve', this._crossServed.bind(this));
    }
    async newSocket(socket) {
        this.socketPool[socket.user.id] = socket;
        socket.on('msg', this._customerMsg.bind(this, socket.user.id));
        socket.on('service_request', this._serviceRequest.bind(this,socket.user.id));
        socket.on('comment', this._comment.bind(this, socket.user.id));
        socket.on('leave_msg', this._leaveMsg.bind(this, socket.user.id));
        socket.on('disconnect', this._disconnect.bind(this, socket.user.id));
        //为socket设置附加属性
        socket.servingState = SERVING_STATUS_ROBOT; //一开始只与机器人对话
        socket.serviceOperatorId = null;
        socket.chatId = null;
        //发送问候或者留言回复
        var answerId = await util.cache.getAsync(`${util.PREFIX_MESSAGE_ANSWERED}:${socket.user.id}`);
        if(answerId){
            //用户的留言已经被回答
            var msg = await model.message.findById(answerId);
            var operator = await model.operator.findById(msg.answerOperatorId);
            socket.session.data.serviceRecord[socket.opGroup] = operator.id;
            await util.cache.delAsync(`${util.PREFIX_MESSAGE_ANSWERED}:${socket.user.id}`);
            socket.emit('message_answered', {answer:msg.answer, 
                content:msg.content,
                name:operator.name,
                imgUrl:operator.portrait});
        }
        else{
            var opGroup = await model.operatorGroup.findById(socket.opGroup);
            socket.emit('msg', {msg:opGroup.specialRobotAnswer.greet,isPic:false});
        }
        //会话量统计更新
        util.cache.incr(`${util.STAT_SESS_GROUP}:${socket.opGroup}`);
    }
    _serviceRequest(customerId) {
        this.event.emit('allocate_operator', this.socketPool[customerId]);
    }
    _operatorAllocated(customerId, allocated, operatorId, operator) {
        if(allocated){
            this.socketPool[customerId].servingState = SERVING_STATUS_WAITING;
            this.socketPool[customerId].serviceOperatorId = operatorId;
        }
        operator = operator || {};
        this.socketPool[customerId].emit('service_response', {allocated:allocated, 
            portrait:operator.portrait,
            name:operator.name});
    }
    _operatorConnected(customerId, chatId) {
        var socket = this.socketPool[customerId];
        if(socket){
            socket.chatId = chatId;
            socket.servingState = SERVING_STATUS_CHATTING;
            socket.emit('operator_connected');
            //人工服务统计数据更新
            util.cache.incr(`${util.STAT_MANUAL_GROUP}:${socket.opGroup}`);
            //相应的客服的会话数据更新
            util.cache.incr(`${util.STAT_SESS_OPERATOR}:${socket.serviceOperatorId}`);
        }
        else{
            //用户已经断开连接
            chatLogger.withDrawChat(chatId);
            this.event.emit('crash', "connecting", socket.serviceOperatorId,customerId);
        }
    }
    _crossServed(customerId, crosserId,chatId, operator){
        var socket = this.socketPool[customerId];
        if(socket){
            socket.chatId = chatId;
            socket.serviceOperatorId = crosserId;
            socket.emit('cross_serve', {name:operator.name, imgUrl:operator.portrait});
        }
        else{
            //用户已经断开连接
            chatLogger.withDrawChat(chatId);
            this.event.emit('crash', "connecting", socket.serviceOperatorId,customerId);
        }
    }
    //处理从客户方发来的消息
    async _customerMsg(customerId, msg) {
        var socket = this.socketPool[customerId];
        if(!socket)
            return;
        if(socket.servingState === SERVING_STATUS_ROBOT){
            //提供机器人服务
            var answer =  await robot.getAutoAnswer(msg.msg, socket.opGroup);
            socket.emit('msg',{msg:answer, isPic:false});
        }
        else if(socket.servingState === SERVING_STATUS_CHATTING){
            //向客服处发送消息
            var operatorId = this.socketPool[customerId].serviceOperatorId;
            //记录本条消息
            chatLogger.newMsg(socket.chatId, msg, "customer");
            this.event.emit('msg', operatorId, customerId, msg);
            //更新客服组消息数统计信息
            util.cache.incr(`${util.STAT_MSG_GROUP}:${socket.user.operatorGroupId}`);
            //更新客服收到消息数统计
            util.cache.incr(`${util.STAT_MSG_OP_REQ}:${socket.serviceOperatorId}`);
        }
    }
    //处理从客服方发来的消息
    _operatorMsg(customerId, msg) {
        var socket = this.socketPool[customerId];
        if(!socket)
            return;
        //客服发送消息数更新
        util.cache.incr(`${util.STAT_MSG_OP_RES}:${socket.serviceOperatorId}`);
        this.socketPool[customerId].emit('msg', msg);
    }
    _endService(customerId) {
        var socket = this.socketPool[customerId];
        if(!socket)
            return;
        this.socketPool[customerId].emit('operator_disconnected');
        this.socketPool[customerId].servingState = SERVING_STATUS_COMMENTING;
    }
    async _comment(customerId, comment){
        var socket = this.socketPool[customerId];
        chatLogger.commentChat(socket.chatId, comment);
        await chatLogger.finishChat(socket.chatId);
        //评价结束之后一个完整的流程走完
        socket.servingState = SERVING_STATUS_ROBOT;
        //只有在用户评价一个客服后用户下一次才会被分配到这个客服
        socket.session.data.serviceRecord[socket.opGroup] = socket.serviceOperatorId;
        //评价数统计信息更新
        util.cache.incr(`${util.STAT_COMMENT_GROUP}:${socket.opGroup}`);
        util.cache.incr(`${util.STAT_COMMENT_OPERATOR}:${socket.serviceOperatorId}`);
        //满意度统计数据更新
        if(Number(comment) > util.SATISFACTORY_THRESHOLD){
            util.cache.incr(`${util.STAT_SATISFIED_GROUP}:${socket.opGroup}`);
            util.cache.incr(`${util.STAT_SATISFIED_OPERATOR}:${socket.serviceOperatorId}`);
        }
    }
    /**
     * @param {Array} customerIdList 
     */
    _crash(customerIdList) {
        for(let i = 0; i < customerIdList.length; ++i){
            var socket = this.socketPool[customerIdList[i]];
            if(socket){
                socket.emit('crash');
                socket.servingState = SERVING_STATUS_ROBOT;
            }
        }
    }
    async _leaveMsg(customerId, content) {
        var socket = this.socketPool[customerId];
        var msgId = await util.cache.getAsync(`${util.PREFIX_MESSAGE_LEFT}:${socket.user.id}`);
        if(msgId){
            //删除旧的留言
            var msgOld = await model.message.findById(msgId);
            await msgOld.remove();
        }
        var msg = new model.message({
            customerId:socket.user.id,
            content:content,
            leftTime:Date.now(),
            answerState:model.message.STATE_UNANSWERED,
            operatorGroupId:socket.opGroup,
        });
        await msg.save();
        await util.cache.setAsync(`${util.PREFIX_MESSAGE_LEFT}:${socket.user.id}`, msg.id);
        socket.emit("msg_left", {success:true});
    }

    async _disconnect(customerId) {
        var socket = this.socketPool[customerId];
        if(!socket){
            return;
        }
        switch (socket.servingState) {
            case SERVING_STATUS_WAITING:
                this.event.emit("crash", "waiting",socket.serviceOperatorId, socket.user.id);
                break;
            case SERVING_STATUS_CHATTING:
                //在聊天过程中断开连接
                await chatLogger.finishChat(socket.chatId);
                this.event.emit("crash", "chatting", socket.serviceOperatorId, socket.user.id);
                break;
            case SERVING_STATUS_COMMENTING:
                //结束聊天过程
                await chatLogger.finishChat(socket.chatId);
                break;
            default:
                break;
        }
        await this.socketPool[customerId].session.save();
        delete this.socketPool[customerId];
    }
}
//使用时应设置operatorListener
module.exports = customerController;