const allocator = require('./operatorAllocator');
const chatLogger = require('../chatLogger');
const util = require('../../utils');
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
        //socket放入池中
        this.socketPool[socket.user.id] = socket;
        socket.waitingList = [];
        socket.chattingSet = {};
        socket.workingState = "working";
        socket.on('get_next', this._getNext.bind(this, socket.user.id));
        socket.on('msg', this._operatorMsg.bind(this, socket.user.id));
        socket.on('end_service', this._endService.bind(this,socket.user.id));
        socket.on('change_status', this._changeStatus.bind(this, socket.user.id));
        socket.on('cross_serve', this._crossServe.bind(this, socket.user.id));
        //设置缓存中客服的状态为working
        util.cache.set(`${util.PREFIX_OPERATOR_STATUS}:${socket.user.id}`, "working");
        this.allocators[socket.user.operatorGroupId].addOperator(socket.user.id);
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
        //从分配器中删除该客服
        this.allocators[socket.user.operatorGroupId].deleteOperator(socket.user.id);
        util.cache.del(`${util.PREFIX_OPERATOR_STATUS}:${socket.user.id}`);
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
                socket.emit("crash", customerId);
                break;
            case "chatting":
                //在会话时客户连接中断
                socket.emit("crash", customerId);
                break;
            default:
                break;
        }
    }
    /**
     * 客服修改自身服务状态
     * 只有在客服队列中没有人且没有与任何人进行聊天时客服才能设置自己的状态为休息
     * 向前端返回change_status, {success:boolean}
     * 在缓存中设置自身的状态为休息
     * 同时对allocators做相应的增加或者删除操作
     */
    async _changeStatus(operatorId, state){
        var socket = this.socketPool[operatorId];
        if(state === socket.workingState){
            socket.emit("change_state", {success:true});
            return;
        }
        if(state === "resting"){
            if(Object.keys(socket.chattingSet).length || socket.waitingList){
                socket.emit("change_state", {success:false});
                return;
            }
            await util.cache.setAsync(`${util.PREFIX_OPERATOR_STATUS}:${socket.user.id}`, "resting");
            socket.workingState = "resting";
            this.allocators[socket.user.operatorGroupId].deleteOperator(socket.user.id);
       }
        else if(state === "working"){
            await util.cache.setAsync(`${util.PREFIX_OPERATOR_STATUS}:${socket.user.id}`, "working");
            socket.workingState = "working";
            this.allocators[socket.user.operatorGroupId].addOperator(socket.user.id);
        }
        socket.emit("change_state", {success:true});
        return;
    }
    async _crossServe(operatorId,customerId, crosserId){
        var socket = this.socketPool[operatorId];
        var socketCrosser = this.socketPool[crosserId];
        //该客服是否可以分配
        if(!this.socketPool[crosserId] || this.socketPool[crosserId].workingState !== "working"){
            return;
        }
        //结束本次会话，记录会话为转接的会话
        var chatIdOld = socket.chattingSet[customerId];
        await chatLogger.finishChat(chatIdOld, {crossed:true, crosserId:crosserId});
        socket.chattingSet[customerId] = null;
        //会话加入转接者的chattingSet
        var chatId = chatLogger.createChat(customerId, crosserId);
        socketCrosser.chattingSet[customerId] = chatId;
        socketCrosser.emit('cross_served',customerId, chatIdOld);
        this.event.emit('cross_served', customerId, crosserId, chatId);
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