function operatorControler(){
    this.operators = {};
    this.operatorAccepted = 0;
    const event = require('events');
    this.event = new event();
    this.customerListener = null;
    this.operatorAllocator = require('./operatorAllocator');

    //设置event处理函数
    this.event.on('allocate_operator', this._allocateOperator.bind(this));
    this.event.on('msg', this._customerMsg.bind(this));
    this.event.on('crash', this._crash.bind(this));
}

operatorControler.prototype.newSocket = function(socket){
    var tmpId = ++this.operatorAccepted;
    this.operators[this.operatorAccepted] = {socket:socket, waitingList:[], chatting:new Set()};
    this.operatorAllocator.addOperator(this.operatorAccepted);

    socket.on('get_next', this._getNext.bind(this, tmpId));
    socket.on('msg', this._operatorMsg.bind(this));
    socket.on('end_service', this._endService.bind(this, tmpId));
    socket.on('disconnect', this._disconnect.bind(this, tmpId));
};

//customerSession中应当保存上一次分配的客服的id,应当在这个函数中完成
//传来的customerId应该用来找到这个customer
operatorControler.prototype._allocateOperator = function(customerId, customerSession){
    //TODO:添加熟人优先分配算法
    var res =  this.operatorAllocator.allocateOperator();
    if(res)
    {
        //分配了有效的客服，则对客服进行通知
        this.operators[res].socket.emit('new_customer', customerId);
        this.operators[res].waitingList.push(customerId);
    }
    this.customerListener.emit('operator_allocated',customerId, res);
};
operatorControler.prototype._getNext = function(operatorId){
    var operator = this.operators[operatorId];
    var nextId = operator.waitingList.shift();
    if(nextId)
    {
        operator.socket.emit('get_next', nextId);
        operator.chatting.add(nextId);
        this.customerListener.emit('operator_connected', nextId);
    }
    
};
operatorControler.prototype._customerMsg = function(customerId, operatorId, msg){
    if(this.operators[operatorId]){
        this.operators[operatorId].socket.emit('msg', customerId, msg);
    }
};
operatorControler.prototype._operatorMsg = function(customerId, msg){
    this.customerListener.emit('msg', customerId, msg);
};
operatorControler.prototype._endService = function(operatorId, customerId){
    this.customerListener.emit('end_service', customerId);
    this.operators[operatorId].chatting.delete(customerId);
};
//TODO:增加对于operator的状态检查，客服可能处于休息状态
operatorControler.prototype._disconnect = function(operatorId){
    var operator = this.operators[operatorId];
    var listener = this.customerListener;
    operator.waitingList.forEach(() => {
        listener.emit('crashed');
    });
    operator.chatting.forEach(() => {
        listener.emit('crashed');
    });
    this.operators[operatorId] = null;
    this.operatorAllocator.deleteOperator(operatorId);
};
operatorControler.prototype._crash = function(operatorId, customerId){
    this.operators[operatorId].socket.emit('crash', customerId);
}

//外部使用时应当设置customerListener

module.exports = operatorControler;