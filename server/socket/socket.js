const io = require('socket.io')();
//中间件设置
const middlewares = require('./socketMiddlewares');
io.use(middlewares.auth);
//接入socket之后的控制处理
const {URL} = require('url');
var customer = new (require('./customer/customerController'))();
var operator = new (require('./operator/operatorController'))();
customer.operatorListener = operator.event;
operator.customerListener = customer.event;
io.on('connection', socket=>{
    var path = new URL(socket.handshake.headers.referer);
    if(path.pathname === "/client.html"){
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