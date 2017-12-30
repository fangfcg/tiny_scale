//设定测试环境
process.env.IS_TEST = true;

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const model = require('../models/models');
const server = require('../server');
const cache = require('../utils').cli;
describe('function test', function(){
    before(async function(){
        await model.connect();
        await server.startServer();
    });
    //在每一个suit结束时清空测试数据库以及服务器会话存储
    afterEach(async function(){
    });
    //在全部功能测试结束后清空数据库并结束进程
    after(async function(){
        console.log('finished');
        await model.disconnect();
        await server.stopServer();
        await cache.flushdbAsync();
        await cache.quitAsync();
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