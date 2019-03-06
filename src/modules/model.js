import Node from './node';

export default class Board {
    //TODO: Need to receive a two-dimension array fill with weight values for every cell. 
    constructor(rowSize, colSize) {
        this.rowSize = rowSize;
        this.colSize = colSize;
        this.matrix = [...Array(rowSize)].map((e, rowPos) => {           
            return  [...Array(colSize)].map((e, colPos) => {   
                return new Node(rowPos, colPos, 1)
            });
        });
        this.startCell = {};
        this.finishCell = {};
        this.obstacles = [];
        
    }

    getStartCell() {
        return this.startCell;
    }
    setStartCell(row, col) {
        console.log(this.matrix);
        
        this.matrix[row][col].startCell = true;
        this.startCell = {
            row,
            col
        };
    }

    getFinishCell(row, col) {
        return this.finishCell;
    }

    setFinishCell(row, col) {
        this.matrix[row][col].finishCell = true;
        this.finishCell = {
            row, 
            col
        };
    }
    setBlockedCell(row, col) {
        this.matrix[row][col].blockedCell = !this.matrix[row][col].blockedCell;
    }

    expand(node) {
        let neighbours = [];
        let xPos = node.x, yPos = node.y;
        console.log(node);
        
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
}


