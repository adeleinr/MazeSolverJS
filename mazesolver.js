/**
 * @fileoverview Maze class.
 * @author adeleinr@gmail.com (Adelein Rodriguez)
 */

 /**
 * Class to represent a sliding puzzle game.
 * @constructor
 */
var Maze = function() {

  /**
   * Input grid containing true and false for each square.
   * true if a wall is present, false if no wall
   * @type {Array[][]}
   */
  this.inputGrid;

  /**
   * Maze start node.
   * @type {GraphNode.<Object>}
   */
  this.startNode;

  /**
   * Maze end node.
   * @type {GraphNode.<Object>}
   */
  this.endNode;

  /**
   * HTML5 canvas.
   * @type {Object}
   */
  this.canvas;

  /**
   * HTML5 canvas context.
   * @type {Object}
   */
  this.canvasCtx;

  /**
   * Maze graph containing a GraphNodes thats to be used
   * for solving the shortest path.
   * @type {Object}
   */
  this.graph;

  /**
   * Timer for animating the computed path.
   * @type {Object}
   */
  this.timer;

  /**
   * Loop counter for animating the computed path.
   * @type {int}
   */
  this.pathStep;

  /**
   * Loading mask element.
   * @type {Element}
   */
  this.loadingMask;

  /**
   * Solve button element.
   * @type {Element}
   */
  this.solveButton;

  this.init();
};

/**
 * API URL to read maze metadata.
 * @type {String}
 */
Maze.DATA_URL =
    'https://s3-us-west-1.amazonaws.com/circleup-challenge/maze.json';

/**
 * Reads maze data and draws the maze.
 * @public
 */
Maze.prototype.init = function() {
  var onSolveClick;

  this.canvas = document.getElementById('maze-display-canvas');

  this.canvasCtx = this.canvas.getContext("2d");

  this.pathStep = 0;

  this.solveButton = document.getElementById('solve');

  this.loadingMask = document.getElementById('loading-mask');

  this.showLoadingMask_();
  var onMazeDataCallback = this.onMazeDataCallback_.bind(this);

  $.getJSON(Maze.DATA_URL, onMazeDataCallback);

  onSolveClick = this.onSolveClick_.bind(this);
  this.solveButton.addEventListener('click', onSolveClick, false);
};

/**
 * On data ready callback. Creates graph and
 * renders maze on canvas.
 * @private
 */
Maze.prototype.onMazeDataCallback_ = function(data) {
  this.inputGrid = data.maze;
  this.graph = new Graph(this.inputGrid);
  this.startNode = new GraphNode(data.start.x, data.start.y, false);
  this.endNode = new GraphNode(data.end.x, data.end.y, false);

  this.render_();
  this.showCanvas_();
  this.hideLoadingMask_();
};

/**
 * Draws shortest path and disables button
 * @private
 */
Maze.prototype.onSolveClick_ = function() {

  this.drawShortestPath_();
  this.hideLoadingMask_();
  this.showCanvas_();

  this.solveButton.disabled = true;

};


Maze.prototype.showCanvas_ = function() {
  this.canvas.style.display = 'block';
};


Maze.prototype.showLoadingMask_ = function() {
  this.loadingMask.style.display = 'block';
};


Maze.prototype.hideLoadingMask_ = function() {
  this.loadingMask.style.display = 'none';
};

/**
 * Renders the maze on canvas
 * @private
 */
Maze.prototype.render_ = function() {
  var rows = this.inputGrid.length;
  var cols = this.inputGrid[0].length;

  for(var i = 0, y = 0; i < rows && y <= rows*10; i++, y=y+10){
    currRow = this.inputGrid[i];

    for(var j = 0, x = 0; j < cols && x <= cols*10; j++, x=x+10){
      if(currRow[j]){
        this.canvasCtx.fillStyle = "black";
      }else{
        this.canvasCtx.fillStyle = "white";
      }
      this.canvasCtx.fillRect(x, y, 10, 10);

    }
  }
  this.canvasCtx.fillStyle = "green";
  this.canvasCtx.fillRect(this.startNode.x*10, this.startNode.y*10, 10, 10);
  this.canvasCtx.fillStyle = "red";
  this.canvasCtx.fillRect(this.endNode.x*10, this.endNode.y*10, 10, 10);

};

/**
 * Draws shortest path.
 * @private
 */
Maze.prototype.drawShortestPath_ = function() {
  var result = this.findShortestPath_();

  // Debug
  /*for(var i = 0; i < result.length; i++){
    console.log(result[i]);
  }*/

  this.pathStep = 0;

  var callback = this.onTimerCallback_.bind(this, result);
  this.timer = setInterval(callback, 100); // 100ms
};


/**
 * Computes shortest path using A* algorithm
 * @return {Array<GraphNodes>} Returns list of GraphNodes
 * representing the shortest path.
 * @private
 */
Maze.prototype.findShortestPath_ = function() {
  var result = pathalgo.findPath(this.graph, this.startNode, this.endNode);
  return result;
};

/**
 * Animation timer callback
 * @param {Array<GraphNodes>} Array of GraphNodes representing
 * the shortest path.
 * @private
 */
Maze.prototype.onTimerCallback_ = function(result) {
  this.canvasCtx.fillStyle = "blue";
  console.log(this.pathStep);
  console.log(result[this.pathStep].y * 10 + " " + result[this.pathStep].x*10);

  this.canvasCtx.fillRect(result[this.pathStep].y * 10,
      result[this.pathStep].x * 10, 10, 10);

  this.pathStep++;
  if (this.pathStep >= result.length){
    clearInterval(this.timer);
  }
};









