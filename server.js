const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    console.log('user connected:', socket.id);

    socket.on('drawing-data', (data) => {
        socket.broadcast.emit('drawing-data', data);
    });

    socket.on('start-drawing', (data) => {
        socket.broadcast.emit('start-drawing', data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id);
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
