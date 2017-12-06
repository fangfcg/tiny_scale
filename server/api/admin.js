var model = require('../models/models').models;
var util = require('../utils');
//restful格式{code, data, msg}, code 为0表示成功，非0表示失败
async function getGroupInfo(req, res){
    var map = {sessionCount:'sessionCounts',
        messageCount:'msgCounts'};
    req.body = req.query;
    req.body.id = req.user.id;
    var admin = req.user;
    var group = await model.operatorGroup.findById(admin.operatorGroupId);
    //根据dataType确定返回的数据类型
    if(!util.bodyContains(req, 'dataType')){
        //返回该管理员下面的全部客服的id和名称
        var operatorList = await model.operator.find(
            {operatorGroupId:group.id});
        var result = [];
        operatorList.forEach(element => {
            result.push({id:element.id, name:element.name});
        });
        res.json(result);
    }
    else{
        //返回服务数据
        var list = group[map[req.body.dataType]] || [];
        var result = util.wrapArrayData(group.serviceRecordStart, list);
        res.json(result);
    }
}

async function getOperatorInfo(req, res){
    req.body = req.query;
    var map = {sessionCount:'sessionCounts', messageCount:'msgCounts'};
    if(!util.bodyContains(req, 'id')){
        res.json({code:1});
        return;
    }
    var operator = await model.operator.findById(req.body.id);
    if(!operator){
        res.json({code:1, msg:'operator not found'});
        return;
    }
    //防止不同组的管理员获取客服的信息
    if(operator.operatorGroupId.toString() != req.user.operatorGroupId.toString()){
        res.json({code:1, msg:'not belong to same group'});
        return;
    }
    if(req.body.dataType){
        var list = operator[map[req.body.dataType]] || [];
        var result = util.wrapArrayData(operator.serviceRecordStart, list);
        res.json(result);
    }
}

module.exports.apiInterfaces = [
    {url:'/api/admin/group_info', callBack:getGroupInfo, auth:true},
    {url:'/api/admin/operator_info', callBack:getOperatorInfo, auth:true},
];