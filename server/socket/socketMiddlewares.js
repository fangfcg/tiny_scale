const session = require('../session');

/**
 * 
 * @param {SocketIO.Socket} socket 
 * @param {function} next 
 */
async function auth(socket, next){
    let token = socket.handshake.query.token;
    var ses = await session.getSession(token);
    ses.data = ses.data || {};
    ses.data.passport = ses.data.passport || {};
    if(!ses.data.passport.user){
        socket.disconnect(true);   
        return; 
    }
    else{
        socket.emit('auth');
        socket.session = ses;
        socket.session.data.hello = 'hi';
        await ses.save();
        return next();
    }
}

module.exports.auth = auth;