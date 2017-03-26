var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/mainpage.html');
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    
    socket.on('data message', function(data){
        console.log(data);
        io.emit('data message', data);
    });
});

http.listen(process.env.PORT, function(){
  console.log('listening on *:proEnvPORT');
});