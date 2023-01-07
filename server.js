const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const { engine } = require('express-handlebars');
const randomData = require('./faker');

const PORT = 3000;
const app = express();
const httpserver = new HttpServer(app);
const io = new IOServer(httpserver);

app.use(express.static('views'));

app.engine('handlebars', engine());
app.set('views', './views');
app.set('view engine', 'handlebars');

app.get('/api/products-test', (req, res) => {
    res.render('table');
});

io.on('connection', async socket => {
    console.log('Conexión establecida');
    const data = randomData();
    io.sockets.emit('products', data);
    socket.on('product', async data => {
        io.sockets.emit('products', data);
    })
});

const server = httpserver.listen(PORT, () => console.log(`Server running on port ${PORT}`));
server.on('error', () => console.log(`Error: ${err}`));