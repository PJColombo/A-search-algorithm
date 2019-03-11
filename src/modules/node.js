export default class Node {
    constructor(x, y, weight) {
        this.x = x;
        this.y = y;
        this.parent = null;
        this.g = 0;
        this.f = 0;
        this.h = 0;
        this.visited = false;
        this.closed = false;
        this.blockedCell = false;
        this.weight = weight;
        this.startCell = false;
        this.finishCell = false;
    }

    restart() {
        this.parent = null;
        this.g  = this.f = this.h = 0;
        this.visited = this.closed =  
            this.startCell = this.finishCell = false;
        // this.weight = 1;
    }

    get key() {
        return `${this.x}-${this.y}`;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }
    getH() {
        return this.h;
    }

    setH(h) {
         this.h = h;
    }

    getG() {
        return this.g;
    }

    setG(value) {
        this.g = value;
    }

    getF() {
        return this.f;
    }

    calculateDistance(originNode) {
        /* Origin node is in a diagonal position */
        if(originNode && this.x !== originNode.x && this.y !== originNode.y)
            return Math.sqrt(2) * this.weight;
        else
            return this.weight;
    }
}