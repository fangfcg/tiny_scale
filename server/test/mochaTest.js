var assert = require('assert');
var expect = require('chai').expect;
describe('Array', function(){
    it('should return -1 when the value not present', function(){
        assert.equal(-1, [1, 2, 4].indexOf(3));
        expect([123, 456]).to.be.a('array');
    });
    it('should be ok', async function(){
        if(1){
            throw(new Error('what?'));
        }
    });
    require('./subTest');
});;
