// start slingin' some d3 here.

var width = 700;
var height = 450;
var numEnemies = 25;


var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(32," + (height / 2) + ")");


for (var i = 0; i < numEnemies; i++) {
  d3.select('svg').append('circle')
    .attr('class', 'enemy')
    .attr('r', 10);
}

svg = d3.select('svg');

function update(data) {

  // DATA JOIN
  // Join new data with old elements, if any.
  var enemies = svg.selectAll("circle")
      .data(data);

  //console.log(enemies);
  //console.log(enemies[0].data)

 enemies.transition().duration(1000)
  .attr("cx", function(d, i) { return d.x; })
  .attr("cy", function(d, i) { return d.y; });

 //enemies.transition().duration(750).attr("cy", function(d, i) { return d.y; });

  /*// UPDATE
  // Update old elements as needed.
  //text.attr("class", "update");

  // ENTER
  // Create new elements as needed.
  text.enter().append("text")
      .attr("class", "enter")
      .attr("dy", ".35em")
      .text(function(d) { return d; });

  // ENTER + UPDATE
  // Appending to the enter selection expands the update selection to include
  // entering elements; so, operations on the update selection after appending to
  // the enter selection will apply to both entering and updating nodes.


  // EXIT
  // Remove old elements as needed.
  text.exit().remove();*/


}

setInterval(function() {
  update(generateLocations());
}, 1000);

var generateLocations = function() {
  var output = [];
  for (var i = 0; i < numEnemies; i++) {
    var coord = {x: Math.random() * width, y: Math.random() * height};
    output.push(coord);
  };
  return output;
}
