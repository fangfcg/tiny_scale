//设定测试环境
process.env.IS_TEST = true;

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const model = require('../models/models');
const server = require('../index');
describe('function test', function(){
    //在每一个suit结束时清空测试数据库以及服务器会话存储
    afterEach(async function(){
        await model.dropDatabase();
        await server.clearServerState(); 
    });
    //在全部功能测试结束后清空数据库并结束进程
    after(async function(){
        await model.disconnect();
        await server.stopServer();
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