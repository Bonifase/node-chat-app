const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const port = 3000;

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})
// javascript room
app.get('/javascript', (req, res) => {
    res.sendFile(__dirname + '/public/javascript.html')
})
// python
app.get('/python', (req, res) => {
    res.sendFile(__dirname + '/public/python.html')
})
app.get('/java', (req, res) => {
    res.sendFile(__dirname + '/public/java.html')
})
app.use(express.static(path.join(__dirname, 'public')));

// tech namespace
const tech = io.of('/tech');

// emit message when new user join room
tech.on('connection', (socket) => {

    // listen to join event, data is the room passed from the client
    socket.on('join', (data) => {
        socket.join(data.room);
        // emit message to whoever in a specific room
        tech.in(data.room).emit('message', `New user joined ${data.room} room!`);
    })
    
    socket.on('message', (data) => {
        console.log(`meaage ${data.msg}`);
        tech.in(data.room).emit('message', data.msg);
    });
    socket.on('disconnect', (data) => {
        console.log('user disconnected');
        tech.in(data.room).emit('message', 'user disconnected');
    });
})