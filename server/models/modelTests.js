const model = require('./models').models;

/*
//创建示例
var opGroup = new model.operatorGroup({name:'hello'});
opGroup.save(function(err, group){
    if(err){console.error(err);}
    console.log(group);
    process.exit(0);
});
*/

/*
//查找示例
model.operatorGroup.find((err, groups)=>{
    console.log(groups);
    process.exit(0);
});
*/

/*
//外键测试
async function foreignKeyTest()
{
    //var group = new model.operatorGroup({name:"First Group"});
    //await group.save();
    var group = await model.operatorGroup.findOne({name:"First Group"});
    if(!group)
    {
        group = new model.operatorGroup({name:"First Group"});
        await group.save();
    }
    var name_operator = 'operator1';
    var operator = await model.operator.findOne({name:name_operator});
    if(!operator)
    {
        operator = new model.operator({name:name_operator,
             operatorGroupId:group.id});
        await operator.save();
    }
    operator = await model.operator.findOne({operatorGroupId:group.id});
    console.log(operator);
    process.exit(0);
}
foreignKeyTest();
*/
/*
//数组元素测试
async function arrayFieldTest(){
    var group = await model.operatorGroup.findOne({name:"ArrayTest"});
    if(!group)
    {
        group = new model.operatorGroup({name:"ArrayTest", serviceRecordStart:Date.now()});
        await group.save();
        group.sessionCounts.push(0);
        await group.save();
    }
    process.exit(0);
}
arrayFieldTest();*/

async function objfy(){
    var a = new model.operator({name:'hello', pass:'123'});
    await a.save();
    var b = await model.operator.findOne({name:'hello'});
    var c = b.toObject();
    console.log(Object.keys(c).filter(attr=>{
        return !attr.startsWith('_');
    }));
}
objfy();