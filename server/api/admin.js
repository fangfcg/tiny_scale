var model = require('../models/models');
var util = require('./utils');
//restful格式{code, data, msg}, code 为0表示成功，非0表示失败
async function getGroupInfo(req, res){
    if(!util.bodyContains(req, 'id')){res.json({code:1});return;}
    try{var admin = await model.admin.findById(req.body.id);}
    catch(err){res.json({code:1, msg:err});return;}
    if(!admin){res.json({code:1}); return;}
    var group = await model.operatorGroup.findById(admin.operatorGroupId);
    res.json({code:0, data:util.doc2Object(group)});
}

module.exports.apiInterfaces = [
    {url:'/api/admin/group_info', callBack:getGroupInfo, auth:true},
];