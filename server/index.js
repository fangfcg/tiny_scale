var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const {URL} = require('url');

var customer = new (require('./controlers/customer/customerController'))();
var operator = new (require('./controlers/operator/operatorController'))();

//设置listener
customer.operatorListener = operator.event;
operator.customerListener = customer.event;

//设置静态文件传输
server.listen(12345, function(){
    console.log('listening at port 12345');
});

//app.use(express.static(__dirname + '/test_pages'));
io.on('connection', socket=>{
    var path = new URL(socket.handshake.headers.referer);
    /*
    if(path.pathname === "/customer.html"){
        customer.newSocket(socket);
    }
    else{
        operator.newSocket(socket);
    }
    */
    if(path.port == '8081'){
        customer.newSocket(socket);
    }
    else{
        operator.newSocket(socket);
    }
});