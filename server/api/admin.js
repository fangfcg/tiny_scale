var model = require('../models/models').models;
var util = require('../utils');
//restful格式{code, data, msg}, code 为0表示成功，非0表示失败
async function getGroupInfo(req, res){
    var map = {sessionCount:'sessionCounts',
        manualRate:'manualServiceRates', 
        messageCount:'msgCounts'};
    req.body = req.query;
    if(!util.bodyContains(req, 'id')){res.json({code:1});return;}
    try{var admin = await model.admin.findById(req.body.id);}
    catch(err){res.json({code:1, msg:err});return;}
    if(!admin){res.json({code:1}); return;}
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
        res.json(util.wrapArrayData(group.serviceRecordStart, list));
    }
}

module.exports.apiInterfaces = [
    {url:'/api/admin/group_info', callBack:getGroupInfo, auth:true},
];