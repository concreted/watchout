var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var socket = io;
var players = [];
var shurikens = [];

var width = 500;
var height = 500;
var numEnemies = 25;
var radius = 20
var score = 0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', onConnect);

function onConnect(socket) {
  console.log('user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  console.log(players)
  socket.emit('sync players',players)
  socket.on('player joined', joinGame)
  socket.on('player left', leaveGame);
}


http.listen(3000, function(){
  console.log('listening on *:3000');
});

app.use(express.static('.'));

function sendUpdates(){
  socket.emit('sync players',players)
  socket.emit('sync shurikens', shurikens)
}
var generateLocations = function() {
  var output = [];
  for (var i = 0; i < 25; i++) {
    var coord = {x: Math.random() * width * 8/10, y: Math.random() * 8/10 * height};
    output.push(coord);
  };
  return output;
}

setInterval(function() {
  shurikens = generateLocations();
  sendUpdates();

}, 100);

function joinGame(data) {

  //var newPlayer = new Player();
  for (var i = 0; i < players.length; i++) {
    if (players[i].id === data.id) {
      return;
    }
  }
  console.log('player joined!');
  players.push(data);
  console.log(players);
  socket.emit('sync players', players);
}

function leaveGame(data) {
  console.log('player left!');

  for (var i = 0; i < players.length; i++) {
    if (players[i].id === data.id) {
      players.splice(i, 1);
    }
  };

  console.log(players);
  socket.emit('sync players', players);
}
