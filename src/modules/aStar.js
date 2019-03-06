// import BinaryHeap from './binaryHeap';
import HeuristicFactory from './heuristicFactory';
import { FibonacciHeap } from '@tyriar/fibonacci-heap';


export default class AStar {
    
    constructor(heuristic) {
        this.heuristicMethod = HeuristicFactory.getInstance().getHeuristic(heuristic);
        this.openList = new FibonacciHeap((n1, n2) => {
            let f1 = n1.key.f, f2 = n2.key.f;
            
            if(f1 < f2)
                return -1;
            else if(f1 > f2)
                return 1;
            else
                return 0;
        });
        this.openListTrack = new Map();
        this.closeList = new Map();
    }
    /**
     * It searchs the best path to the finish cell and returns the path
     * from start to finish if it's reachable 
     * @param {*} board 
     */
    search(board) {
        let {row: sRow, col: sCol} = board.getStartCell(),
            {row: fRow, col: fCol} = board.getFinishCell();
        let startNode, endNode, currentNode;
        startNode = board.matrix[sRow][sCol];
        endNode = board.matrix[fRow][fCol];
        
        //Add starting cell
        let a = this.openList.insert(startNode);
        
        this.openListTrack.set(startNode.key, a);
        
        while(this.openList.size() > 0) {
            currentNode = this.openList.extractMinimum().key;
            
            this.closeList.set(currentNode.key, true);

            if(currentNode.finishCell)                
                return this.calculatePath(currentNode);
            else {                
                let neighbours = board.expand(currentNode);
                
                let g, isVisited;
                neighbours.forEach(neighbour => {
                    g = currentNode.g + neighbour.calculateDistance(currentNode);
                    isVisited = neighbour.visited;

                    /* If node is already in the close list pass to the
                    next neighbour.*/
                    if(this.closeList.get(neighbour.key) || neighbour.blockedCell)
                        return
                    
                    if(!isVisited || g < neighbour.getG()) {
                        neighbour.parent = currentNode;
                        neighbour.visited = true;
                        neighbour.g = g;
                        neighbour.h = this.heuristicMethod(neighbour, endNode);
                        neighbour.f = neighbour.g + neighbour.h;
                        
                        if(!isVisited){                            
                            this.openListTrack.set(neighbour.key, this.openList.insert(neighbour));
                        }
                        else {
                            this.openList.decreaseKey(this.openListTrack.get(neighbour.key), neighbour);
                        }
                    }
                });
            }
        }

        return [];
    }
    calculatePath(node) {
        let path = [];  
        let currentNode = node;
        while(currentNode.parent) {
            path.unshift(currentNode);
            currentNode = currentNode.parent;
        }
        console.log("Path");
        console.log(path);
        
        
        return path;
    }
}

//babel-core babel-loader babel-preset-env

/* En el package.json */
/* "build": "webpack -p" */