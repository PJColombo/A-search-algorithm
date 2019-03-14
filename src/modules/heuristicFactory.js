export default class HeuristicFactory {
    static getInstance() {
        if(this.heuristicFactory === null ||
            this.heuristicFactory === undefined)
            return new HeuristicFactory();
        else
            return this.heuristicFactory;
    }

    getHeuristic(heuristic) {
        switch(heuristic.toUpperCase()) {
            /* Use it when you're allow to move in four 
            directions only. */
            case "MANHATTAN":
                return (node1, node2) => {
                    let x1 = node1.x, x2 = node2.x,
                        y1 = node1.y, y2 = node2.y;
                    let d1 = Math.abs(x2 - x1);
                    let d2 = Math.abs(y2 - y1);

                    return d1 + d2;
                }
            /* Use it when you're allow to 
            move in eight directions only  */
            case "DIAGONAL":
                return (node1, node2) => {
                    let x1 = node1.x, x2 = node2.x,
                        y1 = node1.y, y2 = node2.y;
                    return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
                }
            /* Use it when you're allow to move in any
            direction.  */
            case "EUCLIDEAN":
                return (node1, node2) => {
                    let x1 = node1.x, x2 = node2.x,
                        y1 = node1.y, y2 = node2.y;
                    let op1 = Math.pow(Math.abs(x2 - x1), 2),
                        op2 = Math.pow(Math.abs(y2 - y1), 2);

                    return Math.sqrt(op1 + op2);
                }
            default:
                return (node1, node2) => {
                    let x1 = node1.x, x2 = node2.x,
                        y1 = node1.y, y2 = node2.y;
                    let op1 = Math.pow(Math.abs(x2 - x1), 2),
                        op2 = Math.pow(Math.abs(y2 - y1), 2);

                    return Math.sqrt(op1 + op2);
                }
        }
    }
}