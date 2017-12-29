//配置会话存储
var session = require('express-session');
var store = new session.MemoryStore();  //暂时使用内存型会话存储
/*
var redis   = require("redis");
var client  = redis.createClient();
var redisStore = require('connect-redis')(session);
var store = new redisStore({
        host:'localhost', 
        port:6379,
        client:client,});
*/
const sessionSecret = 'secret';
const sessionName = 'connect.sid';

//使用parser对sessionId进行加解密
var secretCookieParser = require('cookie-parser')(sessionSecret);
var bareCookieParser = require('cookie-parser')();
//对store进行promisify
const blueBird = require('bluebird');
store = blueBird.promisifyAll(store);
secretCookieParser = blueBird.promisify(secretCookieParser);
bareCookieParser = blueBird.promisify(bareCookieParser);

module.exports.configApp = function(app){
    app.use(session({
        secret: sessionSecret,
        resave: false,
        name: sessionName,
        saveUninitialized:false,
        store: store}));
};

module.exports.clearStore = async function(){
     await new Promise((res, rej)=>{
         store.clear((err)=>{
            if(err){rej(err);return;}
            res();
         });
     });
};
//传入的sessionId应该是加密的
module.exports.getSession = async function(sessionId){
    sessionId = `${sessionName}=${sessionId}`;
    var req = {headers:{cookie:sessionId}};
    await secretCookieParser(req, {});
    var sid = req.signedCookies[sessionName];
    //加密的cookie应在signedCookies中
    var s = await store.getAsync(sid);
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