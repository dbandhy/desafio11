import express from 'express'
import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url';
import routers from './routers/index.js'
import { initSocket } from './socket.js'
import { randomUUID } from 'crypto';
//desafio 12
import cookieParser from 'cookie-parser';
import session from 'express-session';
import sfs from 'session-file-store';
import MongoStore from 'connect-mongo';
import handlebars from 'express-handlebars';
import fs from 'fs'
import { PORT } from './config.js'
//desafio 14
import dotenv from 'dotenv'
import parseArgs from 'minimist'
import { fork } from 'child_process';
import {objectAleatorio} from'./controllers/getObject.js'


const fileStore = sfs(session)

const port = 8080
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


const args = parseArgs(process.argv.slice(2));
//const PORT = args.p ?? 8080;

//conexión mongo
const mongoUrl = "mongodb://localhost/coderhouse"

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

// // //handlebars
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


//desafio 14

app.get('/info', (req, res) => {
  
dotenv.config()

  const info = {
        dir: process.cwd(),
        idProceso: process.pid,
        nodeVersion: process.version,
        path: process.execPath,
        OS: process.platform,
        memoria: JSON.stringify(process.memoryUsage().rss, null, 2),

  }
  res.json(info)
  
})
app.get(`/api/randoms`, (req, res) => {
  res.render(`objectRandomIn`)
});

app.post('/api/randoms', (req, res) => {
  //CALCULO
  const { cantBucle } =  req.body;
  process.env.CANT_BUCLE = cantBucle;

  const objectRandom = fork(`./controller/getObject.js`);
  objectRandom.on(`message`, dataRandom => {
      //console.table(dataRandom)
      return res.send(dataRandom);
    })
})

app.get(`/objectRandomOut`, (req, res) => {
  res.render(`objectRandomOut`)
});



app.use('/login', routers);


const server = http.createServer(app);
initSocket(server);




//LISTEN
server.listen( port, () => {
  console.log(`http://localhost:${server.address().port}/login`)
})

server.on("error", error => console.log(`Error en servidor ${error}`));

