const io = require('socket.io')();
//中间件设置
const middlewares = require('./socketMiddlewares');
io.use(middlewares.auth);
//接入socket之后的控制处理
var customer = new (require('./customer/customerController'))();
var operator = new (require('./operator/operatorController'))();
customer.operatorListener = operator.event;
operator.customerListener = customer.event;
io.on('connection', socket=>{
    if(socket.handshake.query.type === "customer"){
        customer.newSocket(socket);
    }
    else{
        operator.newSocket(socket);
    }
});

function configSocket(server){
    io.listen(server);
}
module.exports.configSocket = configSocket;