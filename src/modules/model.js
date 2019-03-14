import Node from './node';

export default class Board {
    constructor(rowSize, colSize, random, w1, w2, w3, percentage) {
        this.rowSize = rowSize;
        this.colSize = colSize;
        /* Setting random parameters */        
        if(percentage)
            this._obstaclesPercentage = percentage;
        else
            this._obstaclesPercentage = 0.3;    
        if(w1)
            this._weight1 = w1;
        else
            this._weight1 = 2;
        
        if(w2)
            this._weight2 = w2;
        else
            this._weight2 = 5;
        
        if(w3)
            this._weight3 = w3;
        else
            this._weight3 = 8;

        this.matrix = this.generateMatrix(random);
        this._startCell = {};
        this._finishCell = {};

    }

    get startCell() {
        return this._startCell;
    }
    set startCell(cell) {
        if(this._startCell && this._startCell.hasOwnProperty("row") && this._startCell.hasOwnProperty("col"))
            this.matrix[this._startCell.row][this._startCell.col].startCell = false;
        if(cell && cell.hasOwnProperty("row") && cell.hasOwnProperty("col"))
            this.matrix[cell.row][cell.col].startCell = true;
        this._startCell = cell;
    }    

    get finishCell() {
        return this._finishCell;
    }
    set finishCell(cell) {
        if(this._finishCell && this._finishCell.hasOwnProperty("row") && this._finishCell.hasOwnProperty("col"))
            this.matrix[this._finishCell.row][this._finishCell.col].finishCell = false;
        if(cell && cell.hasOwnProperty("row") && cell.hasOwnProperty("col"))
            this.matrix[cell.row][cell.col].finishCell = true;
        this._finishCell = cell;
    }

    set obstaclesPercentage(percentage) {
        this._obstaclesPercentage = percentage;        
    }

    set weight1(weight) {
        this._weight1 = weight;
    }
    set weight2(weight) {
        this._weight1 = weight;
    }
    set weight3(weight) {
        this._weight3 = weight;
    }
    getWeightCell(cell) {
        if(cell && cell.hasOwnProperty("row") && cell.hasOwnProperty("col"))
            return this.matrix[cell.row][cell.col].weight;
    }
    setWeightCell(cell) {
        if(cell && cell.hasOwnProperty("row") && cell.hasOwnProperty("col")
            && cell.hasOwnProperty("weight"))
            this.matrix[cell.row][cell.col].weight = cell.weight;
    }
    setBlockedCell(row, col) {
        this.matrix[row][col].blockedCell = !this.matrix[row][col].blockedCell;
    }

    expand(node) {
        let neighbours = [];
        let xPos = node.x, yPos = node.y;
        
        if(this.matrix[xPos - 1]) {
            // Left 
            if(this.matrix[xPos - 1][yPos])
            neighbours.push(this.matrix[xPos - 1][yPos]);

            if(this.matrix[xPos - 1][yPos - 1])
                neighbours.push(this.matrix[xPos - 1][yPos - 1]);

            if(this.matrix[xPos - 1][yPos + 1])
                neighbours.push(this.matrix[xPos - 1][yPos + 1]); 

            }
            
        if(this.matrix[xPos + 1]) {
            // Right
            if(this.matrix[xPos + 1][yPos])
                neighbours.push(this.matrix[xPos + 1][yPos]);
            
            if(this.matrix[xPos + 1][yPos - 1])
                neighbours.push(this.matrix[xPos + 1][yPos - 1]);

            if(this.matrix[xPos + 1][yPos + 1])
                neighbours.push(this.matrix[xPos + 1][yPos + 1]);
        }

        // Up
        if(this.matrix[xPos][yPos - 1])
            neighbours.push(this.matrix[xPos][yPos - 1]);
        
        // Down
        if(this.matrix[xPos][yPos + 1])
            neighbours.push(this.matrix[xPos][yPos + 1]);
        
        return neighbours; 
    }

    restart(shallowRestart = false) {
        this.matrix.forEach(col => {
            col.forEach(node => {
                node.restart(shallowRestart);
            });
        });

    }

    generateMatrix(random) {
        let r;
        let matrix = [...Array(this.rowSize)].map((e, rowPos) => {
            return [...Array(this.colSize)].map((e, colPos) => {
                let n = new Node(rowPos, colPos, 1);
                r = Math.random();
                if(random) {
                    if(r < this._obstaclesPercentage)
                        n.blockedCell = true;
                    else if(r >= this._obstaclesPercentage && r < this._obstaclesPercentage + 0.15)
                        n.weight = this._weight1;
                    else if(r >= this._obstaclesPercentage + 0.15 && r < this._obstaclesPercentage + 0.25)
                        n.weight = this._weight2;
                    else if(r >= this._obstaclesPercentage + 0.25 && r < this._obstaclesPercentage + 0.35)
                        n.weight = this._weight3;
                }
                
                return n;
            });
        });
        return matrix;
    }
}


