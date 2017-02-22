var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
app.use(express.static(__dirname + '/public'));
//Arrays for users and connections
users = [];
connections = [];

//server listens on port 3000
server.listen(3000);
console.log("Server now running on port 3000");

//Route. On homepage, take in request and response
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html')
});

//Once a connection is established, the function is invoked.
//takes in unique connection parameter 'socket'
io.sockets.on('connection', function(socket){
  connections.push(socket);
  console.log('Connected sockets: ' +connections.length);

  //on disconnect
  socket.on('disconnect', function(data) {

    //remove socket from connection
    connections.splice(connections.indexOf(socket), 1);
    console.log("Disconnected. Connected sockets: " +connections.length);

    //if user leaves without signing up
    if(!socket.username) return;

    //indexOf finds index of variable passed
    //remove username from user list
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
  });

  //new user
  socket.on('new user', function(data, callback) {
    callback(true);
    console.log("New user: "+data);
    //assign username from data into local variable
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  });

  function updateUsernames() {
    //pushes updated userlist to clientside
    io.sockets.emit('get users', users);
  }
  //send message
  socket.on('send message', function(data){
    //The parameters we send will all be sent in object called 'data' in the client side
    //We can acces them using data.variable(data.msg or data.user), the value assigned is a local variable
    //from the server side, in this case 'data' and 'socket.username'
    io.sockets.emit('new message', {msg:data, user:socket.username});
  });

  //
});
