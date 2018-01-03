const robot = require('../../api/robot');
const chatLogger = require('../chatLogger');
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
    }
    newSocket(socket) {
        this.socketPool[socket.user.id] = socket;
        socket.on('msg', this._customerMsg.bind(this, socket.user.id));
        socket.on('service_request', this._serviceRequest.bind(this,socket.user.id));
        socket.on('comment', this._comment.bind(this, socket.user.id));
        //为socket设置附加属性
        socket.servingState = SERVING_STATUS_ROBOT; //一开始只与机器人对话
        socket.serviceOperatorId = null;
        socket.chatId = null;
    }
    _serviceRequest(customerId) {
        this.event.emit('allocate_operator', customerId);
    }
    _operatorAllocated(customerId, allocated, operatorId) {
        if(allocated){
            this.socketPool[customerId].servingState = SERVING_STATUS_WAITING;
            this.socketPool[customerId].serviceOperatorId = operatorId;
        }
        this.socketPool[customerId].emit('service_response', allocated);
    }
    _operatorConnected(customerId, chatId) {
        var socket = this.socketPool[customerId];
        if(socket){
            socket.chatId = chatId;
            socket.servingState = SERVING_STATUS_CHATTING;
            socket.emit('operator_connected');
        }
        else{
            //用户已经断开连接
            chatLogger.withDrawChat(chatId);
            this.event.emit('crash', "connecting", socket.serviceOperatorId,customerId);
        }
    }
    _crossServed(customerId, crosserId,chatId){
        var socket = this.socketPool[customerId];
        if(socket){
            socket.chatId = chatId;
            socket.serviceOperatorId = crosserId;
            socket.emit('cross_served', crosserId);
        }
        else{
            //用户已经断开连接
            chatLogger.withDrawChat(chatId);
            this.event.emit('crash', "connecting", socket.serviceOperatorId,customerId);
        }
    }
    //处理从客户方发来的消息
    _customerMsg(customerId, msg) {
        var socket = this.customers[customerId];
        if(socket.servingState === SERVING_STATUS_ROBOT){
            //提供机器人服务
            var answer =  robot.getAutoAnswer(msg.msg, socket.opGroup);
            socket.emit('msg',{msg:answer});
        }
        else if(socket.servingState === SERVING_STATUS_CHATTING){
            //向客服处发送消息
            var operatorId = this.socketPool[customerId].serviceOperatorId;
            chatLogger.newMsg(socket.chatId, msg, "customer");
            this.event.emit('msg', operatorId, customerId, msg);
            //记录本条消息
        }
    }
    //处理从客服方发来的消息
    _operatorMsg(customerId, msg) {
        this.socketPool[customerId].emit('msg', msg);
    }
    _endService(customerId) {
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
    }
    /**
     * @param {Array} customerIdList 
     */
    _crash(customerIdList) {
        for(let i = 0; i < customerIdList.length; ++i){
            var socket = this.socketPool[customerIdList[i]];
            socket.emit('crash');
            socket.servingState = SERVING_STATUS_ROBOT;
        }
    }
    async _disconnect(customerId) {
        var socket = this.socketPool[customerId];
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
        this.socketPool[customerId] = null;
    }
}
//使用时应设置operatorListener
module.exports = customerController;