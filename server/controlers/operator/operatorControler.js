function operatorControler(){
    this.operators = {};
    this.operatorAccepted = 0;
    this.event = require('events').EventEmitter();
    this.customerListener = null;
    this.operatorAllocator = require('./operatorAllocator');

    //设置event处理函数
    this.event.on('allocate_operator', this.allocateOperator);
    this.event.on('msg', this.customerMsg.bind(this));
}

operatorControler.prototype.newSocket = function(socket){
    var tmpId = ++this.operatorAccepted;
    this.operators[this.operatorAccepted] = {socket:socket, waitingList:[], chatting:new Set()};
    socket.handshake.session.tempId = this.operatorAccepted;    //tempId只用来作为在线客服的索引
    this.operatorAllocator.addOperator(this.operatorAccepted);

    socket.on('get_next', this.getNext.bind(this, tmpId));
    socket.on('msg', this.operatorMsg.bind(this));
    socket.on('end_service', this.endService.bind(this));
    socket.on('disconnect', this.disconnect.bind(this, tmpId));
};

//customerSession中应当保存上一次分配的客服的id,应当在这个函数中完成
//传来的customerId应该用来找到这个customer
operatorControler.prototype.allocateOperator = function(customerId, customerSession){
    //TODO:添加熟人优先分配算法
    var res =  this.operatorAllocator.allocateOperator();
    if(res)
    {
        //分配了有效的客服，则对客服进行通知
        this.operators[res].socket.emit('new_customer', customerId);
        this.operators[res].waitingList.push(customerId);
    }
    this.customerListener.emit('operator_allocated', res);
};
operatorControler.prototype.getNext = function(operatorId){
    var operator = this.operators[operatorId];
    var nextId = operator.waitingList.shift();
    operator.socket.emit('get_next', nextId);
    operator.chatting.add(nextId);
};
operatorControler.prototype.customerMsg = function(customerId, operatorId, msg){
    this.operators[operatorId].socket.emit('msg', customerId, msg);
};
operatorControler.prototype.operatorMsg = function(customerId, msg){
    this.customerListener.emit('msg', customerId, msg);
};
operatorControler.prototype.endService = function(operatorId, customerId){
    this.customerListener.emit('end_service', customerId);
    this.operators[operatorId].chatting.delete(customerId);
};
//TODO:增加对于operator的状态检查，客服可能处于休息状态
operatorControler.prototype.disconnect = function(operatorId){
    var operator = this.operators[operatorId];
    var listener = this.customerListener;
    operator.waitingList.forEach(() => {
        listener.emit('crashed');
    });
    operator.chatting.forEach(() => {
        listener.emit('crashed');
    });
};

//外部使用时应当设置customerListener

module.exports = operatorControler;