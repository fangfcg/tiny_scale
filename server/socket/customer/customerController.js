const robot = require('../../api/robot');
const SERVING_STATUS_ROBOT = 0;
const SERVING_STATUS_WAITING = 1;
const SERVING_STATUS_CHATTING = 2;
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
    }
    newSocket(socket) {
        this.socketPool[socket.user.id] = socket;
        socket.servingState = SERVING_STATUS_ROBOT; //一开始只与机器人对话
        socket.on('msg', this._customerMsg.bind(this, socket.user.id));
        socket.on('service_request', this._serviceRequest.bind(this,socket.user.id));

        /*
        var id = ++this.customerAccepted;
        this.socketPool[id] = socket;

        //前端发送msg信息是传送的对象的格式{msg:}
        //socket.on('dissconnect', this._disconnect.bind(this, id));
        */
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
    _operatorConnected(customerId) {
        this.socketPool[customerId].servingState = SERVING_STATUS_CHATTING;
        this.socketPool[customerId].emit('operator_connected');
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
            this.event.emit('msg', operatorId, customerId, msg);
        }
    }
    //处理从客服方发来的消息
    _operatorMsg(customerId, msg) {
        this.socketPool[customerId].emit('msg', msg);
    }
    _endService(customerId) {
        this.socketPool[customerId].emit('operator_disconnected');
        this.socketPool[customerId].servingState = SERVING_STATUS_ROBOT;
    }


    _crash(customerId) {
        this.customers[customerId].socket.emit('crash');
        this.customers[customerId].serviceOperatorId = null;
    }
    _disconnect(customerId) {
        var customer = this.customers[customerId];
        if (customer.serviceOperatorId) {
            this.operatorListener.emit('crash', customer.serviceOperatorId);
        }
    }
}
//使用时应设置operatorListener
module.exports = customerController;