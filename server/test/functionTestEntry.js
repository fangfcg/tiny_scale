//设定测试环境
process.env.IS_TEST = true;

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const model = require('../models/models');
describe('function test', function(){
    //在每一个suit结束时清空测试数据库
    afterEach(async function(){
        await model.dropDatabase();
    });
    after(async function(){
        await model.dropDatabase();
        process.exit(0);
    });
    fs.readdirSync(__dirname)
        .filter(file=>{
            return (file.indexOf('.') !== 0) 
            && (file !== basename) 
            && (file.slice(-3) === '.js')
            &&(file.startsWith('fnTest'));
        })
        .forEach(file=>{
            require(path.join(__dirname, file));
        });
});