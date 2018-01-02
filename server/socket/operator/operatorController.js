const allocator = require('./operatorAllocator');
class operatorControler {
    constructor() {
        this.socketPool = {};   //socket池中以客服的id作为索引
        this.operatorAccepted = 0;
        this.event = new (require('events'))();
        this.allocators = {};
    }
    customerEventHandler(customerEvent) {
        customerEvent.on('allocate_operator', this._allocateOperator.bind(this));
        customerEvent.on('msg', this._customerMsg.bind(this));
    }
    newSocket(socket) {
        //对于整个group中第一个上线的operator则新建一个allocator
        if(!this.allocators[socket.user.operatorGroupId]){
            this.allocators[socket.user.operatorGroupId] = new allocator();
        }
        this.allocators[socket.user.operatorGroupId].addOperator(socket.user.id);
        //socket放入池中
        this.socketPool[socket.user.id] = socket;
        socket.waitingList = [];
        socket.on('get_next', this._getNext.bind(this, socket.user.id));
        socket.on('msg', this._operatorMsg.bind(this));
        socket.on('end_service', this._endService.bind(this));
    }
    //传入一个客户的socket，为该客户分配客服
    _allocateOperator(socket) {
        var ses = socket.session;
        var groupId = socket.opGroup;
        ses.serviceRecord = ses.serviceRecord || {};
        var allocated = false;
        var opId;
        if(ses.serviceRecord[groupId]){
            //优先考虑熟人分配算法
            opId = ses.serviceRecord[groupId];
            if(this.socketPool[opId] && this.socketPool[opId].workingState === 'working'){
                allocated = true;
            }
        }
        if(!allocated && this.allocators[groupId]){
            //熟人分配无法实行
            opId =  this.allocators[groupId].allocateOperator();
            if(opId){allocated = true;}
            else{this.allocators[groupId] = null;}  //该客服组无人在线，则分配链表置空
        }
        //如果分配成功，则通知客服的socket有新的用户接入
        if(allocated){
            this.socketPool[opId].emit('new_customer', socket.user.id);
            this.socketPool[opId].waitingList.push(socket.user.id);
        }
        //opId中保留分配的客服的Id，是否分配保留在allocated中
        this.event.emit('operator_allocated', socket.user.id, allocated, opId);
    }
    _getNext(operatorId) {
        var opSock = this.socketPool[operatorId];
        var nextId = opSock.waitingList.shift();
        if(nextId){
            opSock.emit('get_next', nextId);
            this.event.emit('operator_connected', nextId);
        }
        /*
        var operator = this.operators[operatorId];
        var nextId = operator.waitingList.shift();
        if (nextId) {
            operator.socket.emit('get_next', nextId);
            operator.chatting.add(nextId);
            this.customerListener.emit('operator_connected', nextId);
        }*/
    }
    _customerMsg(operatorId, customerId, msg) {
        if(this.socketPool[operatorId]){
            this.socketPool[operatorId].emit('msg', customerId, msg);
        }
    }
    _operatorMsg(customerId, msg) {
        this.event.emit('msg', customerId, msg);
    }
    _endService(customerId) {
        this.event.emit('end_service', customerId);
    }



    //TODO:增加对于operator的状态检查，客服可能处于休息状态
    _disconnect(operatorId) {
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
    }
    _crash(operatorId, customerId) {
        this.operators[operatorId].socket.emit('crash', customerId);
    }
}

//外部使用时应当设置customerListener

module.exports = operatorControler;