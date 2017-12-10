var session = require('../session');
/**
 * @param {Request} req
 * @param {Response} res
 */
async function getSocketToken(req, res){
    var id = await session.getSessionId(req);
    res.json({token:id});
}

module.exports.apiInterfaces = [
    {url:'/api/get_socket_token', callBack:getSocketToken, auth:true},
];