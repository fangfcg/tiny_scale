const model = require('./models/models');
const auth = require('./auth');
const config = require('./serverConfig.json');
const path = require('path');
const util = require('./utils');
async function dbPrepare(){
    await model.connect();
    var startDate = Date.now();//Date.UTC(2016, 10, 1);
    var dataLength = 300;
    var socketToken = "thu1";
    var operatorGroup = new model.models.operatorGroup({
        name:'Group1',
        sessionCounts:initArray(dataLength, 0),
        msgCounts:initArray(dataLength, 0),
        serviceRecordStart:startDate,
        specialRobotAnswer:{greet:`你好我是tinyscale智能机器人`,
        unknown:`不好意思这触及到了我的知识盲区，您可以选择人工客服呦~`},
        robotPortrait:config.static.portrait.robot
    });
    //设置客服组服务数据
    var groupData = initArray(dataLength);
    randFloadfield(groupData, "manualRate");
    randFloadfield(groupData, "commentRate");
    randFloadfield(groupData, "satisfiedRate");
    randIntfield(groupData, 500, 1000, "sessionCount");
    randIntfield(groupData, 3000, 5000, "messageCount");
    operatorGroup.serviceData.concat(groupData);
    var admin = new model.models.admin({
        name:'tinyscale',
        pass:auth.Hash('thss_tinyscale'),
        email:"liangjz@mails.tsinghua.edu.cn",
        portrait:path.join(config.static.portrait.admin, "default.jpg"),
        operatorGroupId: operatorGroup.id,
    });
    groupData.forEach(val => {
        operatorGroup.serviceData.push(val);
    });
    await admin.save();
    var nameList = ['方晨光', '梁健哲', '姜春雨', '易滔'];
    var operatorCount = nameList.length;
    for(let i = 0; i < operatorCount; ++i){
        var operator = new model.models.operator({
            name:nameList[i],
            pass:auth.Hash('tinyscale'),
            email:"thss15@mails.tsinghua.edu.cn",
            serviceRecordStart:startDate,
            operatorGroupId:operatorGroup.id,
            portrait:path.join(config.static.portrait.operator, 'default.jpg')
        });
        var dataList = initArray(dataLength, {});
        randIntfield(dataList, 100, 500, "sessionCount");
        randFloadfield(dataList, "qaRate");
        randFloadfield(dataList, "satisfiedRate");
        randIntfield(dataList, 3000, 5000, "responseTime");
        dataList.forEach(val => {operator.serviceData.push(val);});
        //arraySum(operatorGroup.sessionCounts, operator.sessionCounts);
        //arraySum(operatorGroup.msgCounts, operator.msgCounts);
        await operator.save();
    }
    //设置历史数据
    await util.cache.setAsync(`${util.PREFIX_SOCKET_CLIENT}:${socketToken}`,`${operatorGroup.id}`);
    await operatorGroup.save();
    await model.disconnect();
    await util.cache.quit();
}

function randIntfield(arr, min, max, field){
    for(var i = 0; i < arr.length; ++i){
        arr[i][field]  = Math.floor(Math.random() * (max - min)) + min;
    }
}

function randFloadfield(arr, field){
    for(var i =0 ; i < arr.length; ++i){
        arr[i][field] = Math.random();
    }
}


function initArray(length){
    var res = [];
    for(let i = 0; i < length; ++i){
        res.push({});
    }
    return res;
}
dbPrepare();