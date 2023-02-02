import express from 'express'
import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url';
import routers from './routers/index.js'
import { initSocket } from './socket.js'
import { randomUUID } from 'crypto';
import handlebars from 'express-handlebars';
import ejs from 'ejs'
//desafio 12
import cookieParser from 'cookie-parser';
import session from 'express-session';
import sfs from 'session-file-store';
import MongoStore from 'connect-mongo';
import fs from 'fs'


const fileStore = sfs(session)

const port = 8080
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//conexión mongo
const mongoUrl = 'mongodb://localhost/coderhouse'
//HANDLEBARS 
//const headerTemplate = handlebars.compile(fs.readFileSync("index.html", "utf-8"));


app.use(cookieParser())

app.use(session({
    store: MongoStore.create( {mongoUrl}),
    secret: 'secreto',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 15000
    }
  }))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('public', 'handlebars');
//handlebars

// app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
// app.set('view engine', 'handlebars');


//RUTAS

app.get('/', (req, res) => {
 res.redirect('/login')
});

app.get('/login', (req, res) => {
 res.sendFile('login.html', {root: './public'})
})

app.post('/login', (req, res) => {
  const  username = req.body.firstName;
  req.session.firstName = username;
  res.sendFile('index.html', {root: './public'})
  
    
})

  
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.json({ status: 'Logout ERROR', body: err })
    } else {
      res.sendFile('login.html', {root: './public'})
    }
  })
})

app.use('/login', routers);


const server = http.createServer(app);
initSocket(server);


//LISTEN
server.listen( port, () => {
  console.log(`http://localhost:${server.address().port}/login`)
})

server.on("error", error => console.log(`Error en servidor ${error}`));

