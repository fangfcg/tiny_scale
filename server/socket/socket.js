const io = require('socket.io')();
//中间件设置
const middlewares = require('./socketMiddlewares');
io.use(middlewares.auth);
io.use(middlewares.createUser);
//接入socket之后的控制处理
var customer = new (require('./customer/customerController'))();
var operator = new (require('./operator/operatorController'))();
//设置事件处理函数
customer.operatorEventHandler(operator.event);
operator.customerEventHandler(customer.event);

io.on('connection', socket=>{
    if(socket.userType === "client"){
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