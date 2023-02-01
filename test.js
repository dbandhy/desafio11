
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

const fileStore = sfs(session)

const port = 8080
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//conexión mongo
const mongoUrl = 'mongodb://localhost/coderhouse'

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

// function auth(req, res, next) {
//   if (req.session.user === 'pepe' && req.session.admin) {
//     next()
//   } else
//   res.redirect('./login')
// }
// //
// app.get('/', auth, (req, res) => {
//   res.redirect('/')
// })

 

app.get('/login', (req, res) => {
 res.sendFile('login.html', {root: './public'})
})

app.post('/login', (req, res) => {
  const  username = req.body.firstName;
  req.session.firstName = username;
  res.sendFile('index.html', {root: './public'})
  
    // const { username, password } = req.query
  
    // if (username !== 'pepe' || password !== 'pepepass') {
    //   return res.status(401).send('login failed')
    // }
  
    // req.session.user = username
    // req.session.admin = true
    // res.sendFile('login.html', {root: './public'})
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

app.use('/', routers);


app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (!err) res.send('Logout ok!')
        else res.send({ status: 'Logout ERROR', body: err })
    })
})



const server = http.createServer(app);
initSocket(server);


//LISTEN
server.listen( port, () => {
    console.log(`http server is listening on the port ${server.address().port}`);
    console.log(`http://localhost:${server.address().port}`);
})

server.on("error", error => console.log(`Error en servidor ${error}`));