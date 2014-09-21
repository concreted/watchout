var socket = io();
var localPlayer;
var width = 500;
var height = 500;
var numShurikens = 25;
var radius = 20
var score = 0;
var onlinePlayers = [];
var shurikensLoc = [];

d3.selectAll('#join_game')
  .on('click', joinGame);

d3.selectAll('#leave_game')
  .on('click', leaveGame);

function Player() {
  this.id = Math.floor(Math.random() * 1000);
  this.x = Math.floor(Math.random() * width);
  this.y = Math.floor(Math.random() * height);
}

function joinGame() {
  if(!localPlayer){
    localPlayer = new Player();

    socket.emit('player joined', localPlayer);
  }
}
function leaveGame() {
  if (localPlayer) {
    socket.emit('player left', localPlayer);
    localPlayer = null;
  }
}

function syncOnlinePlayers(data) {
  onlinePlayers = data;
}

socket.on('sync players', syncOnlinePlayers);
socket.on('sync shurikens', syncShurikens);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(32," + (height / 2) + ")");

// Add
for (var i = 0; i < numShurikens; i ++) {
  var r
  d3.select('svg').append('image')
    .attr('class', 'enemy')
    .attr('r', 10)
    .attr('height', 30)
    .attr('width', 30)
    .attr('x', 100)
    .attr('y', 100)
    .attr('xlink:href', 'shuriken.png');
}

// Add player
onlinePlayers.forEach(function(player){
d3.select('svg').append('image')
  .attr('class', 'player')
  .attr('height', 40)
  .attr('width', 40)
  .attr('x', player.x)
  .attr('y', player.y)
  .attr('xlink:href', 'player.png');
});


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

function updatePlayers(data) {

  var players = svg.selectAll('.player')
    .data(data, function(d) {return d.id;});

  players.attr('x', function(d) { return d.x;})
    .attr('y', function(d) {return d.y;});

  players.enter().append('image')
    .attr('class', 'player')
    .attr('height', 40)
    .attr('width', 40)
    .attr('x', function(d) {return d.x})
    .attr('y', function(d) {return d.y})
    .attr('xlink:href', 'player.png');

  players.exit()
    .remove();
}

function syncShurikens(data){
  shurikensLoc = data;
  updateShurikens(data);
}
function updateShurikens(data) {

  // DATA JOIN
  // Join new data with old elements, if any.
  var shurikens = svg.selectAll(".enemy")
      .data(data);

  //console.log(shurikens);
  //console.log(shurikens[0].data)

 shurikens.transition().duration(1000)
  .attr("x", function(d, i) { return d.x; })
  .attr("y", function(d, i) { return d.y; })
  //.attr("fill", function(d) { return generateColor(); });

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
    svg.selectAll('.player')[0].forEach(function(player) {
   //   console.log(player)

      if(checkColliders(enemy,player)){
        score = 0;
        hitAnimation(player);
      }
    });
  });
}


var hitAnimation = function(player) {
  //console.log(player);
  player.setAttribute('href', 'player-hit.png');
  //svg.select('.player').attr('height', 80);
  //svg.select('.player').attr('width', 80);
  setTimeout( function() {
  player.setAttribute('href', 'player.png');
  }, 1000);
}

setInterval(function() {
  updateScore();
  updatePlayers(onlinePlayers);
  checkCollisions();
}, 50);


