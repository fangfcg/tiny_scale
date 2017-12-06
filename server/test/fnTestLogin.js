const expect = require('chai').expect;
const model = require('../models/models');
const auth = require('../auth');

const baseUrl = 'http://localhost:8080'

describe('Login test', function(){
    before(dbInit);
    it('should first return 404 and then not',logTest);
});

var adminId;

async function dbInit(){
    var operatorGroup = new model.models.operatorGroup({
        name:'Group1',
        sessionCounts:[100, 300, 400],
        manualServiceRates:[0.5, 0.8, 1],
        msgCounts:[10, 10, 10],
        serviceRecordStart:Date.UTC(2017, 10, 12),
    });
    await operatorGroup.save();
    var admin = new model.models.admin({
        name:'admin',
        pass:auth.Hash('abcde'),
        operatorGroupId: operatorGroup.id,
    });
    adminId = admin.id;
    await admin.save();
}
async function logTest(){
    var request = require('request');
        request = require('bluebird').promisify(request);
        request =  request.defaults({jar:true, simple:false, resolveWithFullResponse:true, json:true});
    var res = await request({
        url:baseUrl + '/api/admin/group_info',
        method:'GET',
        });
    expect(res.statusCode).to.be.eq(404, "request should be denied without login");
    res = await request({
        url: baseUrl + '/login',
        method:'POST',
        body:{
            type:'admin',
            username:'admin',
            password:'abcde',
        }
    });
    expect(res.statusCode).to.be.eq(200, "login failed");
    var res = await request({
        url:baseUrl + '/api/admin/group_info',
        method:'GET',
        qs:{
            id:adminId,
            dataType:'sessionCount',
        }
        });
    console.log(res.body);
    expect(res.body.data).to.be.a('array', 'should return array in value\'s data field');
}