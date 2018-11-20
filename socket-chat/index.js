var app = require('express')();
var http = require('http').Server(app); //HTTP server
var io = require('socket.io')(http);
var port = process.env.PORT || 3000; // start on port 3000


//route handler / that gets called when we hit our website home
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html'); // serve index.html when routing
});


// load the socket.io-client
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
