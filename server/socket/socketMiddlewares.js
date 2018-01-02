const session = require('../session');
const util = require('../utils');

/**
 * 接入socket时query的参数：
 * {token:如果类型为customer则需要token进行接入公司的验证, 
 *        同时明确该socket要接入的socketGroup是哪个公司
 * session:该用户的sessionId，在接入socket之前通过get方法获取,
 * type:接入的socket的类型}
 * @param {SocketIO.Socket} socket 
 * @param {function} next 
 */
async function auth(socket, next){
    let token = socket.handshake.query.token;
    let sid = socket.handshake.query.session;
    //session通过socket中的request来获取
    var ses = await session.getSession(sid);
    if(!ses){
        socket.disconnect(true);
        return;
    }
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