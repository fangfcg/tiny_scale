//入口文件配置
const server = require('./server');
const model = require('./models/models');
async function start(){
    await model.connect();
    await server.startServer();
}

start();