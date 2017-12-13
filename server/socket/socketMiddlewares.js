const session = require('../session');

/**
 * 
 * @param {SocketIO.Socket} socket 
 * @param {function} next 
 */
async function auth(socket, next){
    let token = socket.handshake.query.token;
    var ses = await session.getSession(token);
    ses = ses || {};
    if(!ses.user){
        return next(new Error('auth failed'));
    }
    return next();
}

module.exports.auth = auth;