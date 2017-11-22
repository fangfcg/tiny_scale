function operatorControler(){
    this.operators = {};
    this.operatorAccepted = 0;
    this.event = require('events').EventEmitter();
    this.customerListener = null;
}

operatorControler.prototype.newSocket = function(socket){
    ++this.operatorAccepted;
    this.operators[this.operatorAccepted] = socket;
    socket.handshake.session.tempId = this.operatorAccepted;
};


//外部使用时应当设置customerListener