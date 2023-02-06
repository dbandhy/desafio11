import express from 'express'
import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url';
import routers from './routers/index.js'
import { initSocket } from './socket.js'
import { createHash, randomUUID } from 'crypto';
//desafio 12
import cookieParser from 'cookie-parser';
import session from 'express-session';
import sfs from 'session-file-store';
import MongoStore from 'connect-mongo';
//Desafio 13
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local'
import bCrypt from 'bcrypt'

//DESAFIO 14
import {PORT } from '/config.js'


const fileStore = sfs(session)

//const port = 8080
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

//middleware
function isValidPassword(firstName, password) {
  return bCrypt.compareSync(firstName, password)
}

//SIGN UP
passport.use('login', new LocalStrategy (
  (firstName, password, done) => {
    User.findOne( {firstName}, (err, user) => {
      if (err)
        return done(err);

      if (!user) {
        console.log('no se encontró' + firstName)
        return done(null, false)
      }

      if (!isValidPassword(user, password)) {
        console.log('contraseña inválida')
        return done(null, false)
      }

      return done(null, user)
    })
  }
))

function isValidPassword(user, password) {
  return bCrypt.compareSync(password, user.password)
}

passport.use('signup', new LocalStrategy ({
  passReqToCallback: true
},
  (req, username, password, done) => {
    User.findOne( {'username': username }, 
      function (err, user) {
        if (err) {
          console.log(err)
          return done(err)
        }

        if (user) {
          console.log('usuario existe')
          return done(null, false)
        }

        const newUser = {
          username: username,
          password: createHash(password),
          email: req.body.email,
          name: req.body.name
        }
      })
  }
))



function auth(req, res, next) {
  if (req.session.user === 'pepe' && req.session.admin) {
    next()
  } else
  res.redirect('./login')
}
//
app.get('/', auth, (req, res) => {
  res.redirect('/')
})

 

app.post('/login', (req, res) => {
    const { username, password } = req.query
  
    if (username !== 'pepe' || password !== 'pepepass') {
      return res.status(401).send('login failed')
    }
  
    req.session.user = username
    req.session.admin = true
    res.redirect('/',  {root: './public'})
  })
 
app.get('/login', (req, res) => {
  res.sendFile('login.html', {root: './public'})
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
    
    console.log(`http://localhost:${server.address().PORT}`);
})

server.on("error", error => console.log(`Error en servidor ${error}`));