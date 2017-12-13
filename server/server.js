var express = require('express');
var app = express();
var server = require('http').createServer(app);
//配置body解析
const bodyParser = require('body-parser');
app['use'](bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//对server进行promisify
const blueBird = require('bluebird');
server = blueBird.promisifyAll(server);

//配置会话
const session = require('./session');
session.configApp(app);

//配置认证机制
const auth = require('./auth');
auth.configApp(app);
//配置路由
const router = require('./api/router');
router.setRoute(app);
//设置socket连接
const socket = require('./socket/socket');
socket.configSocket(server);

const path = require('path');
//设置静态文件夹
app.use(express.static(path.join(__dirname, '../client/dist')));
const config = require('./serverConfig.json');
//供测试时使用
module.exports.clearServerState = async function(){
    if(process.env.IS_TEST){
        await session.clearStore();
    }
};
module.exports.stopServer = async function(){
    await server.closeAsync();
};
//server的启动放在模块之外
module.exports.startServer = async function(){
    await server.listenAsync(config.server.port);
};
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