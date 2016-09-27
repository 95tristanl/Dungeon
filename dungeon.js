/**
 * Created by TristanLeVeille on 9/12/16.
 */

function Node(value) {
    this.value = value;
    this.children = [];
}

function Dungeon() {
    this.head = new Node("0");
    this.pit = new Node("PIT");
    this.end = new Node("END");
    this.nodeList = [this.head];
    this.beenThere = [];
}

Dungeon.prototype.addNode = function(node) {
    this.nodeList.push(node);
};

Dungeon.prototype.connect = function(parent, child) {  //parent is a node and child is a node
    parent.children.push(child);
};

Dungeon.prototype.getRooms = function(scale) {
    var rooms = 0;
    if (scale == "small") {
        rooms = (parseInt(Math.random()*3)) + 3; //3-5
    } else if (scale == "medium") {
        rooms = (parseInt(Math.random()*5)) + 6; //6-10
    } else if (scale == "big") {
        rooms = (parseInt(Math.random()*5)) + 11; //11-15
    } else if (scale == "massive") {
        rooms = (parseInt(Math.random()*10)) + 16; //16-25
    }
    return rooms
};

Dungeon.prototype.getLinksPits = function(rooms, difficulty) {
    var tuple = [0, 0]; //links, pits
    if (difficulty == "easy") {
        tuple[0] = (parseInt(Math.random()*2)) + 2; //2-3
    } else if (difficulty == "medium") {
        tuple[0] = (parseInt(Math.random()*2)) + 3; //3-4
    } else if (difficulty == "hard") {
        tuple[0] = (parseInt(Math.random()*2)) + 4; //4-5
    }
    tuple[1] = this.pitNum(rooms, tuple[0]); //generates number of pits which has to be <= number of links
    return tuple
};

Dungeon.prototype.pitNum = function(rooms, links) {
    var pits = 100; //number larger than links limit
    var boo = 1; //true
    while (boo == 1) {
        var num = (parseInt(Math.random()*50)); //0-49
        if (num == 0) {//0
            pits = 5;
        } else if (num >= 1 && num <= 2) { //1-2
            pits = 4;
        } else if (num >= 3 && num <= 6) { //3-6
            pits = 3;
        } else if (num >= 7 && num <= 14) { //7-14
            pits = 2;
        } else if (num >= 15 && num <= 34) { //15-34
            pits = 1;
        } else if (num >= 35 && num <= 49) { //35-49
            pits = 0;
        }
        if (pits <= links && rooms > links-pits) {
            boo = 0; //false
        }
    }
    return pits; //pits <= links
};

Dungeon.prototype.pickTargets = function(tuple, node, ind) {
    var targets = [];
    var alreadyUsed = [];
    var targetNum = tuple[0] - tuple[1];
    if (node.value == this.head.value) {
        if (targetNum == 0) {
            targetNum = tuple[0] - (tuple[1]-2);
            tuple[1] = tuple[1] - 2;
        }
        for (var i = 1; i <= targetNum; i++) {
            var again = 1; //true
            while (again == 1) {
                var index = (parseInt(Math.random()*(this.nodeList.length)));
                if (index != 0 && alreadyUsed.indexOf(index) == -1) {
                    targets.push(this.nodeList[index]);
                    alreadyUsed.push(index);
                    again = 0; //false
                }
            }
        }
    }
    else if ( !(node.value == this.head.value) ) { //for rest of the nodes except head
        for (var j = 1; j <= targetNum; j++) {
            var again2 = 1; //true
            while (again2 == 1) {
                var index2 = (parseInt(Math.random()*(this.nodeList.length)));
                if (index2 != 0 && index2 != ind && alreadyUsed.indexOf(index2) == -1) {
                    targets.push(this.nodeList[index2]);
                    alreadyUsed.push(index2);
                    again2 = 0; //false
                }
            }
        }
    }
    for (var l = 0; l < tuple[1]; l++) {
        targets.push(this.pit);
    }
    return targets;
};

Dungeon.prototype.generate = function(scale, difficulty) {
    var nodes = this.getRooms(scale);
    for (var k = 1; k <= nodes; k++) {
        this.addNode(new Node("" + k));
    }
    for (var i = 0; i < this.nodeList.length; i++) {
        var tuple = this.getLinksPits(nodes, difficulty);
        var targets = this.pickTargets(tuple, this.nodeList[i], i);
        for (j = 0; j < targets.length; j++) {
            this.connect(this.nodeList[i], targets[j]);
        }
    }
    this.beenThere = [];
    this.pickFinish();
};

Dungeon.prototype.pickFinish = function() {
    var index = (parseInt(Math.random()*(this.nodeList.length-1)));
    this.nodeList[index+1].children[0] = this.end;
};

Dungeon.prototype.solvable = function() {
    for (var i = 0; i < this.nodeList.length; i++) {
        for (var j = 0; j < this.nodeList[i].children.length; j++) {
            if (this.nodeList[i].children[j].value != "PIT" && this.nodeList[i].children[j].value != "END" && this.beenThere.indexOf(this.nodeList[i].children[j].value) == -1) {
                this.beenThere.push(this.nodeList[i].children[j].value);
            }
            if (this.beenThere.length == this.nodeList.length-1) {
                return 1; //true
            }
        }
    }
    return 0;
};

Dungeon.prototype.printDung = function() {
    for (var i = 0; i < this.nodeList.length; i++) {
        console.log(this.nodeList[i].value + " :: ");
        for (var j = 0; j < this.nodeList[i].children.length; j++) {
            console.log(this.nodeList[i].children[j].value);
        }
        console.log("- - - - - - -");
    }
};