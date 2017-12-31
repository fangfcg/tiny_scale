var session = require('../session');
const util = require('../utils');
const model = require('../models/models').models;
/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getSocketToken(req, res){
    var id = await session.getSessionId(req);
    res.json({token:id});
}

/**
 * 传入参数为{type: 用户类型，name:待检查用户名}
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
async function NameCheck(req, res){
    if(!util.bodyContains(req, "type", "name")){
        res.json({success:false});
        return;
    }
    if(req.body.type === "admin"){
        //从admin的collection中进行查找
        var admin = await model.admin.findOne({name:req.body.name});
        res.json({duplicated: admin ? true: false});
    }
    else{
        //在operator中查找
        var operator = await model.operator.findOne({name:req.body.name});
        res.json({duplicated:operator ? true: false});
    }
}

module.exports.apiInterfaces = [
    {url:'/api/get_socket_token', callBack:getSocketToken, auth:true},
    {url:'/api/common/get_token',callBack:NameCheck},
];