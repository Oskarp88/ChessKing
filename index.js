const connectDB  = require('./config/db');
const router = require('./router/routers');
const dotenv = require('dotenv');
const express = require('express');
const colors = require('colors');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const port = 8080;

dotenv.config();

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

app.use('/api', router);

io.on("connection", (socket) => {
  console.log("User Connected: ",socket.id);

  socket.on("join-room", (data) => {
  socket.join(data);

   console.log(`User with ID: ${socket.id} joined room: ${data}`);
 });


  socket.on("send_message", (data) => {
   socket.to(data.room).emit("receive_message", data);
  })

  socket.on("send_move", (data) => {
   socket.to(data.room).emit("opponentMove", data);
  })
  
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  })
})

// Configurar rutas y controladores aquí

server.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`.bgCyan.white);
});

