const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { MongoClient } = require('mongodb');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'drawingBoard';
const collectionName = 'drawings';

async function init() {
  const client = new MongoClient(mongoUrl, { useUnifiedTopology: true });
  await client.connect();

  const db = client.db(dbName);
  const drawingsCollection = db.collection(collectionName);

  app.use(express.static(__dirname));

  io.on('connection', (socket) => {
    console.log('user connected:', socket.id);

    socket.on('drawing-data', async (data) => {
      await saveDrawing(socket.id, data);
      socket.broadcast.emit('drawing-data', data);
    });

    socket.on('start-drawing', (data) => {
      socket.broadcast.emit('start-drawing', data);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected:', socket.id);
    });
  });

  async function saveDrawing(userId, drawingData) {
    const result = await drawingsCollection.insertOne({ userId, drawingData });
    console.log("Drawing saved:", result.insertedId);
  }

  app.get('/drawings/:userId', async (req, res) => {
    const userId = req.params.userId;
    const drawings = await drawingsCollection.find({ userId }).toArray();
    res.json(drawings);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
}

init().catch((error) => {
  console.error("Unable to connect to MongoDB.", error);
});
