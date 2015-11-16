/**
 * @fileoverview Compute shortest path algorithm using A*.
 * @author adeleinr@gmail.com (Adelein Rodriguez)
 */

 /**
 * Literal Object for computing A* shortest path in a graph.
 * @constructor
 */
var pathalgo = {

  /**
    * Find the shortest path from start to the end node
    * using the A* algorithm.
    * We are using a priority queue implemented
    * by https://github.com/janogonzalez
    * In this implementation I am not considering diagonals.
    * @param {Graph} graph
    * @param {GraphNode} start node
    * @param {GraphNode} end node
    * @return {Array<GraphNodes>} shortest path
    */
  findPath: function(graph, start, end){

    var openList = new PriorityQueue(function(a, b) {
      return a.f - b.f;
    });

    start.h = this.computeManhattanDistance_(start, end);
    start.g = 0;
    start.f = 0;
    openList.enq(start);

    while(openList.size() > 0) {
      // Find node with lowest cost
      var currNode = openList.deq();

      if(currNode.x == end.x && currNode.y == end.y) {
        var curr = currNode;
        var shortestPath = [];
        // Traverse back the linkedlist formed
        // using .parent and create the path
        while(curr.parent) {
          shortestPath.push(curr);
          curr = curr.parent;
        }
        return shortestPath.reverse();
      }

      currNode.closed = true;

      var neighbors = graph.neighbors_(currNode);

      for(var i=0; i<neighbors.length; i++){
        neighbor = neighbors[i];

        if (neighbor.closed || neighbor.isWall) {
          continue;
        }

        // g is shortest distance from beginning to this node.
        var g = currNode.g + 1;
        var beenVisited = neighbor.visited;
        var foundBetterCost = false;

        if(!beenVisited){

          neighbor.visited = true;
          foundBetterCost = true;
          // h is the heuristically computed distance from this node to
          // the end node
          neighbor.h = this.computeManhattanDistance_(neighbor,end);
          openList.enq(neighbor);

        }else if(g < neighbor.g){
          foundBetterCost = true;
        }

        if(foundBetterCost){
          neighbor.parent = currNode;
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.g = g;
        }

      }// end for
    }// end while
    // No path found
    return [];

  },
  /**
  * Computes the manhattan distance from this node to the end node.
  * Manhattan distance is the absolute distance disregarding if there
  * are walls or not along the path.
  * @param {GraphNode} start node
  * @param {GraphNode} end node
  * @return {int} shortest distance
  * @private
  */
  computeManhattanDistance_: function(start, end){
    return(Math.abs(start.x-end.x) + Math.abs(start.y-end.y));
  }

}

 /**
 * Class to represent a GraphNode.
 * @constructor
 */
function GraphNode(x, y, isWall) {
      this.x = x;
      this.y = y;
      this.isWall = isWall;
}

/**
 * Prints a node.
 * @public
 */
GraphNode.prototype.toString = function() {
    return "[" + this.x + " " + this.y + "]";
};

/**
* A graph to represent the grid
* @param {Array} 2D input grid that contains true or false for walls
* @constructor
*/
function Graph(inputGrid) {
  this.grid = [];
  for (var x = 0; x < inputGrid.length; x++) {
      this.grid[x] = [];
      for (var y = 0, row = inputGrid[x]; y < row.length; y++) {
        var node = new GraphNode(x, y, row[y]);
        node.f = 0;
        node.g = 0;
        node.h = 0;
        node.visited = false;
        node.closed = false;
        node.parent = null;
        this.grid[x][y] = node;
      }
  }

}

/**
* Computes the neighbors of a node
* @param {GraphNode} the node we want the neighbors of.
* @return {Array<GraphNodes} a list with the neighbors.
* @private
*/
Graph.prototype.neighbors_ = function(node) {
    var neighbors = [];
    var x = node.x;
    var y = node.y;

    if(this.grid[x-1] && this.grid[x-1][y]) {
      neighbors.push(this.grid[x-1][y]);
    }
    if(this.grid[x+1] && this.grid[x+1][y]) {
      neighbors.push(this.grid[x+1][y]);
    }
    if(this.grid[x][y-1] && this.grid[x][y-1]) {
      neighbors.push(this.grid[x][y-1]);
    }
    if(this.grid[x][y+1] && this.grid[x][y+1]) {
      neighbors.push(this.grid[x][y+1]);
    }
    return neighbors;

}
