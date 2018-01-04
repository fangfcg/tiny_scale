//配置会话存储
var session = require('express-session');
//var store = new session.MemoryStore();  //暂时使用内存型会话存储
const blueBird = require('bluebird');
var redis   = require("redis");
blueBird.promisifyAll(redis.RedisClient.prototype);
blueBird.promisifyAll(redis.Multi.prototype);
var client  = redis.createClient();
var redisStore = require('connect-redis')(session);
var store = new redisStore({
        host:'localhost', 
        port:6379,
        client:client,});
const sessionSecret = 'secret';
const sessionName = 'connect.sid';

//使用parser对sessionId进行加解密
var secretCookieParser = require('cookie-parser')(sessionSecret);
var bareCookieParser = require('cookie-parser')();
//对store进行promisify
store = blueBird.promisifyAll(store);
secretCookieParser = blueBird.promisify(secretCookieParser);
bareCookieParser = blueBird.promisify(bareCookieParser);

module.exports.configApp = async function(app){
    //正常情况下选择0号数据库，测试时选择1号
    app.use(session({
        secret: sessionSecret,
        resave: false,
        name: sessionName,
        saveUninitialized:true,
        cookie:{sameSite:false, httpOnly:false},
        store: store}));
    app.use(function(req, res, next){
        blueBird.promisifyAll(req.session);
        next();
    });
};

module.exports.client = client;

module.exports.clearStore = async function(){
   //采用临时的方法删除redis中的会话数据，注意session均是以sess:开头的
   var sessKeys = await client.keysAsync("sess:*");
   await client.delAsync(sessKeys);
};
//传入的sessionId应该是加密的
module.exports.getSession = async function(sessionId){
    sessionId = `${sessionName}=${sessionId}`;
    var req = {headers:{cookie:sessionId}};
    await secretCookieParser(req, {});
    var sid = req.signedCookies[sessionName];
    //加密的cookie应在signedCookies中
    var s = await store.getAsync(sid);
    if(!s){
        return;
    }
    return new sessionObject(sid, s);
};
module.exports.getSessionId = async function(req){
    var req_tmp = {headers:{cookie:req.headers.cookie}};
    await bareCookieParser(req_tmp, {});
    return req_tmp.cookies[sessionName];
};

class sessionObject {
    constructor(id, obj) {
        this.sid = id;
        this.data = obj;    
    }
    async save(){
        await store.setAsync(this.sid, this.data);
    }
}