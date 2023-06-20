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

io.on('connection', socket => {
    console.log('Un usuario se ha conectado');
  
    socket.on('chatMessage', message => {
      io.emit('chatMessage', message); // Envía el mensaje a todos los clientes conectados
    });
  
    socket.on('disconnect', () => {
      console.log('Un usuario se ha desconectado');
    });
  });

// Configurar rutas y controladores aquí

server.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`.bgCyan.white);
});

