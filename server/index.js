var express = require('express');
var app = express();
var server = require('http').createServer(app);
//配置body解析
const bodyParser = require('body-parser');
app['use'](bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//配置会话存储
var session = require('express-session');
var store = new session.MemoryStore();  //暂时使用内存型会话存储
const sessionSecret = 'secret';
const sessionName = 'connect.sid';
app.use(session({
    secret: sessionSecret,
    resave: false,
    name: sessionName,
    saveUninitialized:false,
    store: store}));
//配置认证机制
const auth = require('./auth');
auth.configApp(app);
//配置路由
const router = require('./api/router');
router.setRoute(app);
//启动
server.listen(8080);
module.exports = server;
/*
var io = require('socket.io')(server);

const {URL} = require('url');

var customer = new (require('./controlers/customer/customerController'))();
var operator = new (require('./controlers/operator/operatorController'))();
//设置listener
customer.operatorListener = operator.event;
operator.customerListener = customer.event;

var port  = 8080;

//设置静态文件传输
//app.use(express.static(__dirname + '/test_pages/dist'));
io.on('connection', socket=>{
    var path = new URL(socket.handshake.headers.referer);
    if(path.pathname === "/customer.html"){
        customer.newSocket(socket);
    }
    else{
        operator.newSocket(socket);
    }
});

server.listen(port, function(){
    console.log('listening at port ' + port);
});*/