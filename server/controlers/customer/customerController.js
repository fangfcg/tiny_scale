function customerController(){
    this.customerAccepted = 0;
    this.customers = {};
    this.event = new (require('events'))();
    this.operatorListener = null;

    this.event.on('operator_allocated', this._operatorAllocated.bind(this));
    this.event.on('operator_connected', this._operatorConnected.bind(this));
    this.event.on('msg', this._operatorMsg.bind(this));
    this.event.on('end_service', this._endService.bind(this));
    this.event.on('crash', this._crash.bind(this));
}
customerController.prototype.newSocket = function(socket){
    var id = ++this.customerAccepted;
    this.customers[id] = {socket:socket, serviceOperatorId:null};

    socket.on('service_request', this._serviceRequest.bind(this, id));
    socket.on('msg', this._customerMsg.bind(this, id));
    socket.on('dissconnect', this._disconnect.bind(this, id));
};
customerController.prototype._serviceRequest = function(customerId){
    this.operatorListener.emit('allocate_operator', customerId);
};
customerController.prototype._operatorAllocated = function(customerId ,operatorId){
    this.customers[customerId].serviceOperatorId = operatorId;
    this.customers[customerId].socket.emit('service_response', customerId ? true : false);
};
customerController.prototype._operatorConnected = function(customerId){
    this.customers[customerId].socket.emit('operator_connected');
};
//处理从客户方发来的消息
customerController.prototype._customerMsg = function(customerId, msg){
    var operatorId = this.customers[customerId].serviceOperatorId;
    this.operatorListener.emit('msg', customerId, operatorId, msg);
};
//处理从客服方发来的消息
customerController.prototype._operatorMsg = function(customerId, msg){
    this.customers[customerId].socket.emit('msg', msg);
};
customerController.prototype._endService = function(customerId){
    this.customers[customerId].socket.emit('end_service');
    this.customers[customerId].serviceOperatorId = null;
};
customerController.prototype._crash = function(customerId){
    this.customers[customerId].socket.emit('crash');
    this.customers[customerId].serviceOperatorId = null;
};
customerController.prototype._disconnect = function(customerId){
    var customer = this.customers[customerId]
    if(customer.serviceOperatorId){
        this.operatorListener.emit('crash', customer.serviceOperatorId);
    }
};
//使用时应设置operatorListener
module.exports = customerController;