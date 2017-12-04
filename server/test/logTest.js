process.env.IS_TEST = true;
const expect = require('chai').expect;
const model =  require('../models/models');

describe('db test',function(){
    before(dbInit);
    it('should contain one element', dbTest);
    after(dbTear);
});

async function dbInit(){
    var operator = new model.operator({name:'hello', pass:'12345'});
    await operator.save();
}

async function dbTear(){
    await model.dropDatabase();
    var operator = new model.operator({name:'hello', pass:'12345'});
    await operator.save();
    process.exit(0);
}

async function dbTest(){
    try {
        var operator = await model.operator.findOne({name:"hello"});
    }
    catch(e){
        throw(e);
    }
    expect(operator).to.be.a('Object');
    expect(operator.pass).to.be.eq('12345');
}