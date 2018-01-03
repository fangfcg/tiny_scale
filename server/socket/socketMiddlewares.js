const session = require('../session');
const util = require('../utils');
const model = require('../models/models').models;
/**
 * 接入socket时query的参数：
 * {token:如果类型为customer则需要token进行接入公司的验证, 
 *        同时明确该socket要接入的socketGroup是哪个公司
 * session:该用户的sessionId，在接入socket之前通过get方法获取,
 * type:接入的socket的类型}
 * 用户在接入socket之前可以通过get api/get_session_id获取会话的Id
 * (会话的id虽然以cookie形式保留在本地但是由于是httpOnly的不能通过浏览器中的js获取)
 * 
 * 会话对象保留在socket.session中
 * 如果是客户的socket，接入的公司的id信息保留在socket.opGroup中
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
    //数据保留在ses.data.passport.user中，包含一个id和一个userType
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
/**
 * 对于客户的socket，如果是第一次接入该公司则创建一个Customer文档
 * 对于客服的socket，找到客服文档
 * 用户对象保留在socket.user中
 * 用户类型除了从handShake中获取还可以从socket.userType中获取
 * customer的id保留在session.data.identities[groupId]中
 * @param {SocketIO.Socket} socket 
 * @param {Function} next 
 */
async function addUser(socket, next){
    var sesData = socket.session.data;
    if(socket.handshake.query.type === "customer"){
        //创建客户对象
        if(!sesData.customerIds[socket.opGroup]){
            //创建新用户
            var customer = new model.customer({opeartorGroupId:socket.opGroup});
            await customer.save();
            socket.user = customer;
        }
        else{
            var customer = await model.customer.find({opeartorGroupId:socket.opGroup});
            socket.user = customer;
        }
        socket.userType = "customer";
    }
    else if(socket.handshake.query.type === "operator"){
        var op =  await model.operator.findById(sesData.data.passport.user.id);
        socket.user = op;
        socket.userType = "operator";
    }
   return next();
}
module.exports.auth = auth;
module.exports.createUser = addUser;