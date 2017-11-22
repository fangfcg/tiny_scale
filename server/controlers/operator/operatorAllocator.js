
var LinkedList = require('linked-list');

function OperatorAllocator(){

    this.list = new LinkedList();
    this.node = null;
}

OperatorAllocator.prototype.addOperator = function(operator){
    var item = new LinkedList.Item();
    item.operator = operator;
    this.list.append(item);
    if (this.node === null){
        this.node = this.list.head;
    }
};

OperatorAllocator.prototype.deleteOperator = function(operator){
    
    if (this.list.head !== null){
        var item = this.list.head;
        if (this.list.head.next !== null){
            while (item !== null){
                if (item.operator === operator){
                    if (this.node === item){
                        this.node = this.node.next;
                        if(!this.node){
                            this.node = this.list.head;
                        }
                    }
                    item.detach();
                    break;
                }
                item = item.next;
            }
        }else {
            if (this.list.head.operator === operator){
                item.detach();
                this.node = null; 
            }
        }
    }else{
        var res = null;
        return res;
    }
    
};

OperatorAllocator.prototype.allocateOperator = function(){
    if (this.list.head !== null){
        var res = this.node.operator;
        this.rotationDistribution();
    }else{
        var res = null;
    }
    return res;
};

OperatorAllocator.prototype.rotationDistribution = function(){
    this.node = this.node.next;
    if(!this.node)
    {
        this.node = this.list.head;
    }
};


var allocator = new OperatorAllocator();
module.exports = allocator;
