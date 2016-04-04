var express = require('express');
var app = express();
var port = 5000;

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/template');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

app.get('/', function(req, res){
    res.render('page');
});

var io = require('socket.io').listen(app.listen(port, function(){
    console.log('Listening on Port: ' + port);
}));

io.sockets.on('connection', function(socket){
    socket.emit('message', {message: 'welcome to the chat'});
    socket.on('send', function(data){
        io.sockets.emit('message', data);
    });
});
