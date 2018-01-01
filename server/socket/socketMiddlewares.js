const session = require('../session');
const util = require('../utils');

/**
 * 对socket进行接入验证，在socket.session中保留session对象
 * 浏览器端支持通过如下的方式获取session, 但是暂时未找到在测试中通过socket-client
 * 对request进行操作的方法
 * 要求在socket.request中必须已经包含了session的Id
 * @param {SocketIO.Socket} socket 
 * @param {function} next 
 */
async function auth(socket, next){
    let token = socket.handshake.query.token;
    //session通过socket中的request来获取
    var sesId = await session.getSessionId(socket.request);
    if(!sesId){
        socket.disconnect(true);
        return;
    }
    var ses = await session.getSession(sesId);
    var authed = true;
    //对客服或者管理员的socket进行认证
    if(socket.handshake.query.type !== "customer"){
        ses.data = ses.data || {};
        ses.data.passport = ses.data.passport || {};
        if(!ses.data.passport.user){authed = false;}
    }
    //对用户的socket进行验证
    else{
        //从socket的token中取出值并保留在socket中
        var opGroup = util.cache.get(`${util.PREFIX_SOCKET_CLIENT}:${token}`);
        if(!opGroup){authed = false;}
        else{
            socket.opGroup = opGroup;
        }
    }
    if(!authed){
        socket.disconnect(true);   
        return; 
    }
    else{
        socket.emit('auth');
        socket.session = ses;
        return next();
    }
}

module.exports.auth = auth;