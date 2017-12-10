//入口文件配置
const server = require('./server');

async function start(){
    await server.startServer();
}

start();