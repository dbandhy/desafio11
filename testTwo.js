import express from 'express'
import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url';
import routers from './routers/index.js'
import { initSocket } from './socket.js'

//desafio 12
import cookieParser from 'cookie-parser';
import session from 'express-session';
import sfs from 'session-file-store';
import MongoStore from 'connect-mongo';
import handlebars from 'express-handlebars';
//desafio 13
import flash from 'connect-flash'
import { isValidPassword, createHash } from './crypt/crypt.js';
//desafio 14
import dotenv from 'dotenv'
import parseArgs from 'minimist'
import { fork } from 'child_process';
import passport from 'passport';
import { localStrate} from 'passport-local'
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
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


assport.use('login', new LocalStrategy({
  //Configuración para obtener todo el req.
  passReqToCallback: true
}, async (req, username, password, done) => {
  try {
      const user = await UserModel.findOne({ username });
      if (!user) {
          return done(null, false);
      }
      if (!isValidPassword(user.password, password)) {
          return done(null, false);
      }
      return done(null, user);
  }
  catch (err) {
      done(err);
  }
}));

passport.use('signup', new LocalStrategy({
  //Configuración para obtener todo el req.
  passReqToCallback: true
}, async (req, username, password, done) => {
  try {
      const user = await UserModel.findOne({ username });
      if (user) {
          return done(null, false);
      }

      const newUser = new UserModel();
      newUser.username = username;
      newUser.password = createHash(password); //No se puede volver a conocer la contraseña luego de realizarle el hash
      newUser.email = req.body.email;

      const userSave = await newUser.save();

      return done(null, userSave);
  }
  catch (err) {
      done(err);
  }
}));

passport.serializeUser((user, done) => {
  console.log(`serializeUser`);
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  console.log(`deserializeUser`);
  try {
      const user = await UserModel.findById(id);
      done(null, user);
  } catch (err) {
      done(err);
  }
});

app.get('/login2', (req, res) => {
  return res.render('loginSession');
});

app.get('/signup2', (req, res) => {
  return res.render('signup')
});

app.get(`/bienvenida`, (req, res) => {
  userLog = req.user.username;
  res.render(`bienvenida`, { userLog });
});

app.get(`/errorLog`, (req, res) => {
  res.render(`errorLog`);
});

app.get(`/errorSignup`, (req, res) => {
  res.render(`errorSignup`);
});

app.get(`/logout`, (req, res) => {
  if (req.user) {
      userLogout = req.user.username;
      res.render(`logout`, { userLogout });
      req.session.destroy(err => {
          if (!err) {
              console.log(`ok`)
          } else {
              console.log(`error`)
          }
      });
  }
  res.render(`errorLog`);
});


app.post('/login2', passport.authenticate('login', { 
  successRedirect: '/bienvenida', 
  failureRedirect: `/errorLog`, 
  failureFlash: true  
}));

app.post('/signup2', passport.authenticate('signup', {
  successRedirect: '/', 
  failureRedirect: `/errorSignup`, 
  failureFlash: true 
}));




const server = http.createServer(app);
initSocket(server);




//LISTEN
server.listen( port, () => {
  console.log(`http://localhost:${server.address().port}/login`)
})

server.on("error", error => console.log(`Error en servidor ${error}`));

