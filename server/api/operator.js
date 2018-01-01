const util = require('../utils');
const model = require('../models/models').models;
const auth = require('../auth');
/**
 * post方法，前端发送验证码{certificate:},
 * 后端检验存在该验证码后返回{success:true}
 * 在session中记录该客服对应的客服组id
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
async function certificate(req, res){
    if(!util.bodyContains(req, 'certificate')){
        res.json({success:false});
        return;
    }
    var key = `${util.PREFIX_OPERATOR_CERTIFICATE}:${req.body.certificate}`;
    var certificate = await util.cache.hgetAsync(key, "opGroup");
    if(!certificate){
        res.json({success:false, err:"certificate not found"});
        return;
    }
    //删除该验证码
    await util.cache.delAsync(key);
    //在session中存储已经验证的信息
    req.session.signup = {opGroup:certificate};
    await req.session.saveAsync();
    res.json({success:true});
}
/**
 * post方法
 * 传入业务员的name,pass, email，系统检验已经验证，如果已经验证则
 * 创建业务员表
 * 返回{success:true}
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
async function createOperator(req, res){
    if(!util.bodyContains(req, 'name', 'pass', 'email')){
        res.json({success:false});
        return;
    }
    //是否已经输入验证码
    if(!req.session.signup){
        res.status(404);
        return;
    }
    var operator = new model.operator({name:req.body.name,
        pass:auth.Hash(req.body.pass),
        email:req.body.email,
        operatorGroupId:req.session.signup.opGroup});
    req.session.signup = null;
    await req.session.saveAsync();
    await operator.save();
    res.json({success:true});
    return;
}

module.exports.apiInterfaces = [
    {url:'/api/operator/signup/certificate', callBack:certificate, method:'post'},
    {url:'/api/operator/signup/create_operator',callBack:createOperator, method:'post'}
];