const robot = require('../../api/robot');
class customerController {
    constructor() {
        this.customerAccepted = 0;
        this.event = new (require('events'))();
        this.socketPool = {};
    }
    operatorEventHandler(operatorEvent) {
        operatorEvent.on('operator_allocated', this._operatorAllocated.bind(this));
        operatorEvent.on('operator_connected', this._operatorConnected.bind(this));
        operatorEvent.on('msg', this._operatorMsg.bind(this));
        operatorEvent.on('end_service', this._endService.bind(this));
        operatorEvent.on('crash', this._crash.bind(this));
    }
    newSocket(socket) {
        var id = ++this.customerAccepted;
        this.socketPool[id] = socket;

        //前端发送msg信息是传送的对象的格式{msg:}
        socket.on('msg', this._customerMsg.bind(this, id));

        //socket.on('dissconnect', this._disconnect.bind(this, id));
        //socket.on('service_request', this._serviceRequest.bind(this, id));
    }
    _serviceRequest(customerId) {
        this.event.emit('allocate_operator', customerId);
    }
    _operatorAllocated(customerId, operatorId) {
        this.customers[customerId].serviceOperatorId = operatorId;
        this.customers[customerId].socket.emit('service_response', operatorId ? true : false);
    }
    _operatorConnected(customerId) {
        this.customers[customerId].socket.emit('operator_connected');
    }
    //处理从客户方发来的消息
    _customerMsg(customerSocketId, msg) {
        var socket = this.customers[customerSocketId];
        if(!socket.ManuallyServicing){
            //提供机器人服务
            var answer =  robot.getAutoAnswer(msg.msg, socket.opGroup);
            socket.emit('msg',{msg:answer});
        }
        else{
            //向客服处发送消息
        }
        /*
        var operatorId = this.customers[customerSocketId].serviceOperatorId;
        if (operatorId) {
            this.operatorListener.emit('msg', customerSocketId, operatorId, msg);
        }*/
    }
    //处理从客服方发来的消息
    _operatorMsg(customerId, msg) {
        this.customers[customerId].socket.emit('msg', msg);
    }
    _endService(customerId) {
        this.customers[customerId].socket.emit('operator_disconnected');
        this.customers[customerId].serviceOperatorId = null;
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