const session = require('../session');

/**
 * 
 * @param {SocketIO.Socket} socket 
 * @param {function} next 
 */
async function auth(socket, next){
    let token = socket.handshake.query.token;
    var ses = await session.getSession(token);
    ses = ses || {passport:{}};
    ses.passport = ses.passport || {};
    if(!ses.passport.user){
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