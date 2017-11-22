var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var bodyParser = require('body-parser');

server.listen(3000, function(){
    console.log('listening on 3000');
});

//会话管理
//var redis = require('redis');
var session = require('express-session')({
    secret:"dev secret", 
    resave:false,
    saveUninitialized:false});
var sharedSession = require("express-socket.io-session");

//var redisStore = require('connect-redis')(session);
//var client = redis.createClient();

 //store:new redisStore({host:'localhost',port:6379, client:client, disableTTL:true}) 数据库设定
 //在开发环境下，默认使用express-session提供的内存型会话存储
app.use(session);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',async function(req, res){
    if(!req.session.key){
        req.session.key = 0;
    }
    ++req.session.key;
    await req.session.save();
    res.send("<session saved>");
});

app.get('/hello',function(req, res){
    if(req.session.key)
    {
        res.send('<p>hello!</p>');
    }
    else{
        res.send('<p>???</p>');
    }
    req.session.socket_key = 10;
    req.session.save();
});

app.get('/socket_test', function(req, res){
    res.sendfile(__dirname + '/public/socket.html');
});
app.get('/socket_test_about')

//io 中间件设定
io.use(sharedSession(session, {autoSave:false}));

io.use(function(socket, next){
    console.log(socket.handshake.sessionStore.sessionId);
    next();
});

io.on('connection', function(socket){
    socket.on('auth', function(){
        socket.handshake.session.user = 'hello';
        socket.handshake.session.save();
    });
    socket.on('hello', function(){
        if(socket.handshake.session.user)
            console.log('has user');
    });
});