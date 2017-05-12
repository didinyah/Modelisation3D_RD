var port = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var detector = require('shape-detector');
var detectortest = new ShapeDetector(ShapeDetector.defaultShapes);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/mainpage.html');
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('data_message', function(data){
        console.log(data);
        // data = array of figures
        var figure1 = data[0];
        var figure_reconnue = detectortest.spot(figure1);
        //var figure_reconnue = "cercle";
        io.emit('data_message', data);
        io.emit('figure_detection', figure_reconnue);
    });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
