require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// connect DB
connectDB();
app.use(express.json()); 


// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// create http server + socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// store io on app so routes can use it
app.set('io', io);

io.on('connection', (socket) => {
  console.log('Client connected via socket:', socket.id);
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});


app.post("/api/boards/:boardId/tasks", async (req, res) => {
  try {
    const { title, description } = req.body;
    const board = await Board.findById(req.params.boardId);
    board.tasks.push({ title, description });
    await board.save();
    res.json(board);
  } catch (err) {
    res.status(500).json({ error: "Task add failed" });
  }
});




const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
