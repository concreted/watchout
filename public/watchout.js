// start slingin' some d3 here.

var width = 1000;
var height = 700;
var numEnemies = 25;
var radius = 20
var score = 0;

var generateColor = function() {
  var red = Math.floor(Math.random() * 255).toString(16);
  var green = Math.floor(Math.random() * 255).toString(16);
  var blue = Math.floor(Math.random() * 255).toString(16);
  return "#" + red + green + blue;
};

// Create SVG canvas
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(32," + (height / 2) + ")");

// Add enemies
for (var i = 0; i < numEnemies; i++) {
  var r
  d3.select('svg').append('image')
    .attr('class', 'enemy')
    .attr('r', 10)
    .attr('fill', generateColor())
    .attr('height', 30)
    .attr('width', 30)
    .attr('x', 100)
    .attr('y', 100)
    .attr('xlink:href', 'shuriken.png');
}

// Add player
d3.select('svg').append('image')
  .attr('class', 'player')
  .attr('height', 40)
  .attr('width', 40)
  .attr('x', width/2)
  .attr('y', height/2)
  .attr('xlink:href', 'player.png');


var drag = d3.behavior.drag()
  //.origin(function(d) { return d; })
  .on('drag', dragmove);

// Set player draggable
d3.selectAll('.player').call(drag);

function dragmove(d) {
  d3.select(this)
      .attr("x", d3.event.x - 20)
      .attr("y", d3.event.y - 20)
}

// Rebind svg variable to svg DOM element
svg = d3.select('svg');

function update(data) {

  // DATA JOIN
  // Join new data with old elements, if any.
  var enemies = svg.selectAll(".enemy")
      .data(data);

  //console.log(enemies);
  //console.log(enemies[0].data)

 enemies.transition().duration(1000)
  .attr("x", function(d, i) { return d.x; })
  .attr("y", function(d, i) { return d.y; })
  .attr("fill", function(d) { return generateColor(); });

}

var updateScore = function(){
  score++;
  d3.select('.current').select('span').text(score);
}

var checkCollisions = function() {
  var checkColliders= function(node1, node2){
    /*console.log(node2.getAttribute('x'));
    console.log(node1.getAttribute('x'));*/
    //debugger;
    node1_centerX = node1.getAttribute('x');
    node2_centerX = node2.getAttribute('x');
    node1_centerY = node1.getAttribute('y');
    node2_centerY = node2.getAttribute('y');

    if (Math.abs(node1_centerX - node2_centerX) < 10 && Math.abs(node1_centerY - node2_centerY) < 10)
     // debugger;
    /*var node1_centerX = parseInt(node1.getAttribute('x')) + parseInt(node1.getAttribute('width')/2);
    var node1_centerY = parseInt(node1.getAttribute('y')) + parseInt(node1.getAttribute('height')/2);

    var node2_centerX = parseInt(node2.getAttribute('x')) + parseInt(node2.getAttribute('width')/2);
    var node2_centerY = parseInt(node2.getAttribute('y')) + parseInt(node2.getAttribute('height')/2);*/

    // console.log(node1_centerX + ' ' + node1_centerY);
    //     console.log(node2_centerX + ' ' + node2_centerY)
    //console.log(node2_centerY)
    var delta = 20;

    if((Math.abs(node1_centerX  - node2_centerX) < delta) && (Math.abs(node1_centerY - node2_centerY) < delta)){
      //console.log('pls')
      return true;
    }
    return false;
  };

  svg.selectAll('.enemy')[0].forEach(function(enemy){
    if(checkColliders(enemy,svg.select('.player')[0][0])){
      score = 0;
      hitAnimation();

    }
  });


}

var hitAnimation = function() {
  svg.select('.player').attr('xlink:href', 'player-hit.png');
  //svg.select('.player').attr('height', 80);
  //svg.select('.player').attr('width', 80);
  setTimeout( function() {
  svg.select('.player').attr('xlink:href', 'player.png')
  }, 1000);
}

setInterval(function() {
  updateScore();
  checkCollisions();
}, 50);

setInterval(function() {
  update(generateLocations());
}, 1000);

var generateLocations = function() {
  var output = [];
  for (var i = 0; i < numEnemies; i++) {
    var coord = {x: Math.random() * width * 8/10, y: Math.random() * 8/10 * height};
    output.push(coord);
  };
  return output;
}
