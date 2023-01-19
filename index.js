import express from 'express'
import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url';
import routers from './routers/index.js'
import { initSocket } from './socket.js'
//desafio 12
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { randomUUID } from 'crypto';
import sfs from 'session-file-store';
import MongoStore from 'connect-mongo';

const fileStore = sfs(session)

const port = 8080
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//conexión mongo
//const mongoUrl = 'mongodb://root:mongopassword@localhost:27017/sesiones?authSource=adminnow=1'
const mongoUrl = 'mongodb://localhost/sesiones'

app.use(cookieParser())

// const usuarios = {}
// const fichero = {}
app.use(session({

    store: MongoStore.create( {mongoUrl}),
    secret: 'shhhhhhhhhhhhhhhhhhhhh',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 15000
    }
  }))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// app.post('/api/registro', (req, res) => {
//     const {dni} = req.body
//     const idUsuario = randomUUID()
//     usuarios[dni] = idUsuario
//     fichero[idUsuario] = []
//     res.cookie('nro Socio', idUsuario, {signed: true, maxAge:1000 * 60 * 60 * 24 * 7})
//     res.sendStatus(201)
// })

// app.post('/login', (req, res) => {
//     const {dni} = req.body
//     res.cookie('nro Socio', usuarios[dni], {signed: true, maxAge:1000 * 60 * 60 * 24 * 7})
//     res.sendStatus(200)
// })

app.get('/login', (req, res) => {
    const { username, password } = req.query
  
    if (username !== 'pepe' || password !== 'pepepass') {
      return res.status(401).send('login failed')
    }
  
    req.session.user = username
    req.session.admin = true
    res.send('login success!')
  })
  
  function auth(req, res, next) {
    if (req.session.user === 'pepe' && req.session.admin) {
      return next()
    }
    return res.status(401).send('error de autorización!')
  }
  
  app.get('/privado', auth, (req, res) => {
    console.log(req.session)
    res.send('si estas viendo esto es porque ya te logueaste!')
  })
  
  app.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        res.json({ status: 'Logout ERROR', body: err })
      } else {
        res.send('Logout ok!')
      }
    })
  })

app.use('/api', routers);

let contador = 0
app.get('/sin-session', (req, res) => {
    res.send({ contador: ++contador })
})

app.get('/con-session', (req, res) => {
    if (req.session.contador) {
        req.session.contador++
        res.send(`Ud ha visitado el sitio ${req.session.contador} veces.`)
    }
    else {
        req.session.contador = 1
        res.send('Bienvenido!')
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (!err) res.send('Logout ok!')
        else res.send({ status: 'Logout ERROR', body: err })
    })
})

app.get('/info', (req, res) => {
    console.log('------------ req.session -------------')
    console.log(req.session)
    console.log('--------------------------------------')

    console.log('----------- req.sessionID ------------')
    console.log(req.sessionID)
    console.log('--------------------------------------')

    console.log('----------- req.cookies ------------')
    console.log(req.cookies)
    console.log('--------------------------------------')

    console.log('---------- req.sessionStore ----------')
    console.log(req.sessionStore)
    console.log('--------------------------------------')

    res.send('Send info ok!')
})


const server = http.createServer(app);
initSocket(server);

//middleware de manejo de errores
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

server.listen( port, () => {
    console.log(`http server is listening on the port ${server.address().port}`);
    console.log(`http://localhost:${server.address().port}`);
})

server.on("error", error => console.log(`Error en servidor ${error}`));