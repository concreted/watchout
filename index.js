// Node setup
var util = require("util");

// Socket initialization
var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Player = require('./Player').Player;

var socket,
    players;


function init() {
  players = [];
  setEventHandlers();
};

function onSocketConnection(socket) {
  console.log('a user connected');
  socket.on('disconnect', onClientDisconnect);
  socket.on('new player', onNewPlayer);
  socket.on('move player', onMovePlayer);
};

function onClientDisconnect(){
  console.log('user disconnected');
};

function onNewPlayer(data) {
  console.log('player joined');
  var newPlayer = new Player(data.x, data.y);
  newPlayer.id = this.id;
  players.push(newPlayer);
  console.log(players);
  this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});

  var i, existingPlayer;
  for (i = 0; i < players.length; i++) {
    existingPlayer = players[i];
    this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
  }

}

function onMovePlayer(data) {

}

var setEventHandlers = function() {
  io.on('connection', onSocketConnection);
};


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'));



http.listen(3000, function(){
  console.log('listening on *:3000');
});


init();
