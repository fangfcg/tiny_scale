const allocator = require('./operatorAllocator');
const chatLogger = require('../chatLogger');
const util = require('../../utils');
class operatorControler {
    constructor() {
        this.socketPool = {};   //socket池中以客服的id作为索引
        this.operatorAccepted = 0;
        this.event = new (require('events'))();
        this.allocators = {};
        this.counters = {};     //记录不同客服组在线人数的对象
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
            this.counters[socket.user.operatorGroupId] = 1;
        }
        //socket放入池中
        this.socketPool[socket.user.id] = socket;
        socket.waitingList = [];
        socket.chattingSet = {};
        socket.workingState = "working";
        socket.qaCounter = {};
        socket.on('get_next', this._getNext.bind(this, socket.user.id));
        socket.on('msg', this._operatorMsg.bind(this, socket.user.id));
        socket.on('end_service', this._endService.bind(this,socket.user.id));
        socket.on('change_state', this._changeState.bind(this, socket.user.id));
        socket.on('cross_serve', this._crossServe.bind(this, socket.user.id));
        socket.on('disconnect', this._disconnect.bind(this, socket.user.id));
        //设置缓存中客服的状态为working
        util.cache.set(`${util.PREFIX_OPERATOR_STATUS}:${socket.user.id}`, "working");
        this.allocators[socket.user.operatorGroupId].addOperator(socket.user.id);
    }
    //传入一个客户的socket，为该客户分配客服
    _allocateOperator(socket) {
        if(!socket)
            return;
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
        }
        //如果分配成功，则通知客服的socket有新的用户接入
        if(allocated){
            this.socketPool[opId].emit('new_customer', socket.user.id);
            this.socketPool[opId].waitingList.push(socket.user.id);
            //opId中保留分配的客服的Id，是否分配保留在allocated中
            this.event.emit('operator_allocated', socket.user.id, allocated, opId, this.socketPool[opId].user);
        }
        else{
            this.event.emit('operator_allocated', socket.user.id, false);
        }
    }
    _getNext(operatorId) {
        var socket = this.socketPool[operatorId];
        var nextId = socket.waitingList.shift();
        if(nextId){
            //在socket的正在聊天的集合中添加对象
            var chatId = chatLogger.createChat(nextId, socket.user.id, socket.user.operatorGroupId);
            socket.chattingSet[nextId] = chatId;
            //qaCounter初始化,queried用于记录是否客户已经发送消息而客服没有回复，
            //queryStart用于记录客户本次问答的第一条消息的时间
            socket.qaCounter[nextId] = {};
            socket.qaCounter[nextId].queried = false;
            socket.qaCounter[nextId].queryStart = null;
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
        if(socket && socket.qaCounter[customerId]){
            //qaCounter中记录本次问答初始时间
            if(!socket.qaCounter[customerId].queried){
                socket.qaCounter[customerId].queryStart = msg.time;
                socket.qaCounter[customerId].queried = true;
            }
            socket.emit('msg', customerId, msg);
        }
    }
    _operatorMsg(operatorId,customerId, msg) {
        var socket = this.socketPool[operatorId];
        if(socket && socket.qaCounter[customerId]){
            if(socket.qaCounter[customerId].queried){
                //客服在客户提问后进行了回答
                var interval = msg.time - socket.qaCounter[customerId].queryStart;
                util.cache.incr(`${util.STAT_OP_QA_TURNS}:${socket.user.id}`);
                util.cache.incrby(`${util.STAT_OP_QA_DELAY}:${socket.user.id}`,interval);
                socket.qaCounter[customerId].queried = false;
            }
            chatLogger.newMsg(socket.chattingSet[customerId], msg, "operator");
            this.event.emit('msg', customerId, msg);
        }
    }
    _endService(operatorId,customerId) {
        var socket = this.socketPool[operatorId];
        delete socket.chattingSet[customerId];
        delete socket.qaCounter[customerId];
        this.event.emit('end_service', customerId);
    }

    //TODO:增加对于operator的状态检查，客服可能处于休息状态
    async _disconnect(operatorId) {
        var socket = this.socketPool[operatorId];
        //结束会话
        var chattingCustomers =  Object.keys(socket.chattingSet);
        for(let i = 0; i < chattingCustomers.length; ++i){
            if(chattingCustomers[i]){
                await chatLogger.finishChat(socket.chattingSet[chattingCustomers[i]]);
            }
        }
        //通知所有用户客服socket意外关闭
        this.event.emit('crash', chattingCustomers.concat(socket.waitingList));
        //从分配器中删除该客服
        if(this.allocators[socket.user.operatorGroupId]){
            this.allocators[socket.user.operatorGroupId].deleteOperator(socket.user.id);
            --this.counters[socket.user.operatorGroupId];
        }
        //减少内存的占用
        if(this.counters[socket.user.operatorGroupId] <= 0){
            delete this.counters[socket.user.operatorGroupId];
            delete this.allocators[socket.user.operatorGroupId];
        }
        util.cache.del(`${util.PREFIX_OPERATOR_STATUS}:${socket.user.id}`);
    }
    /**
     * 客户的socket意外关闭时的处理函数
     */
    _crash(type, operatorId, customerId) {
        var socket = this.socketPool[operatorId];
        if(!socket)
            return;
        switch(type){
            case "waiting":
                socket.waitingList = deQue(socket.waitingList, customerId);
                break;
            default:
                delete socket.chattingSet[customerId];
                delete socket.qaCounter[customerId];
                socket.emit("crash", customerId);
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
    async _changeState(operatorId, state){
        var socket = this.socketPool[operatorId];
        if(state === socket.workingState){
            socket.emit("change_state", {success:true});
            return;
        }
        if(state === "resting"){
            if(Object.keys(socket.chattingSet).length){
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
        delete socket.chattingSet[customerId];
        //会话加入转接者的chattingSet
        var chatId = chatLogger.createChat(customerId, crosserId);
        socketCrosser.chattingSet[customerId] = chatId;
        socketCrosser.emit('cross_serve',customerId, chatIdOld);
        this.event.emit('cross_serve', customerId, crosserId, chatId, this.socketPool[crosserId].user);
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