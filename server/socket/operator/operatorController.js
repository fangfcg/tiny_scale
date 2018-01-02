const allocator = require('./operatorAllocator');
const chatLogger = require('../chatLogger');
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
        customerEvent.on("crash", this._crash.bind(this));
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
        socket.chattingSet = {};
        socket.on('get_next', this._getNext.bind(this, socket.user.id));
        socket.on('msg', this._operatorMsg.bind(this, socket.user.id));
        socket.on('end_service', this._endService.bind(this,socket.user.id));
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
        var socket = this.socketPool[operatorId];
        var nextId = socket.waitingList.shift();
        if(nextId){
            //在socket的正在聊天的集合中添加对象
            var chatId = chatLogger.createChat(nextId, socket.user.id);
            socket.chattingSet[nextId] = chatId;
            socket.emit('get_next', {success:true, id:nextId});
            this.event.emit('operator_connected', nextId, chatId);
        }
        else{
            //前端误认为队列中还有人
            socket.emit('get_next', {success:false});
        }
    }
    _customerMsg(operatorId, customerId, msg) {
        var socket = this.socketPool[operatorId];
        if(socket){
            socket.emit('msg', customerId, msg);
        }
    }
    _operatorMsg(operatorId,customerId, msg) {
        var socket = this.socketPool[customerId];
        chatLogger.newMsg(socket.chattingSet[customerId], msg, "operator");
        this.event.emit('msg', customerId, msg);
    }
    _endService(operatorId,customerId) {
        var socket = this.socketPool[operatorId];
        socket.chattingSet[customerId] = null;
        this.event.emit('end_service', customerId);
    }

    //TODO:增加对于operator的状态检查，客服可能处于休息状态
    async _disconnect(operatorId) {
        var socket = this.socketPool[operatorId];
        //结束会话
        var chattingCustomers =  Object.keys(socket.chattingSet);
        for(let i = 0; i < chattingCustomers.length; ++i){
            await chatLogger.finishChat(socket.chattingSet[chattingCustomers[i]]);
        }
        //通知所有用户客服socket意外关闭
        this.event.emit('crash', chattingCustomers.concat(socket.waitingList));
    }
    /**
     * 客户的socket意外关闭时的处理函数
     */
    _crash(type, operatorId, customerId) {
        var socket = this.socketPool[operatorId];
        switch(type){
            case "waiting":
                socket.waitingList = deQue(socket.waitingList, customerId);
                break;
            case "connecting":
                socket.chattingSet[customerId] = null;
                break;
        }
    }
}
function deQue(array, ele){
    for(var i = 0; i < array.length; ++i){
        if(array[i] === ele){
            array = array.slice(0, i).concat(array.slice(i + 1, array.size));
            break;
        }
    }
    return array;
}
//外部使用时应当设置customerListener

module.exports = operatorControler;