var expect    = require("chai").expect;
var operatorAllocator = require('../socket/operator/operatorAllocator.js');
var allocator;
describe('operatorAllocator',function(){
    beforeEach(function(){
        allocator = new operatorAllocator(); 
    });
    afterEach(function(){
        allocator = null;
    });
    it('addOperator',function(){
        allocator.addOperator(1);
        expect(allocator.node.operator).to.equal(1);
    });

    it('deleteOperator',function(){
        allocator.addOperator(1);
        allocator.addOperator(2);
        allocator.deleteOperator(2);
        expect(allocator.node.operator).to.equal(1);
    });

    it('allocateOperator',function(){
        allocator.addOperator(1);
        allocator.addOperator(2);
        allocator.addOperator(3);
        allocator.addOperator(4);
        allocator.addOperator(5);
        expect(allocator.allocateOperator()).to.equal(1);
    });

    it('rotationDistribution',function(){
        allocator.addOperator(1);
        allocator.addOperator(2);
        allocator.rotationDistribution();
        expect(allocator.node.operator).to.equal(2);
    });
});