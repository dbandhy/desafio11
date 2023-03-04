import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import passport from 'passport';
import bCrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';

//desafrio 15
import cluster from 'cluster'
import os from 'os'
import dotenv from 'dotenv'
import parseArgs from 'minimist'
import { User } from './models/users.js';
import { cpus } from 'os'


const args = parseArgs(process.argv.slice(2));
const numCPUs = cpus().length

const mongoDB = "mongodb://localhost/coderhouse"

const app = express();

app.use(cookieParser());
app.use(
	session({
		store: MongoStore.create({
			mongoUrl: mongoDB,
			ttl: 600,
		}),
		secret: "sh",
		resave: false,
		saveUninitialized: false,
		rolling: false,
		cookie: {
			maxAge: 600000,
		},
	})
);

app.engine(	"hbs", handlebars.engine({
		extname: ".hbs",
		defaultLayout: "index.hbs",
	})
);
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

passport.use("login", new LocalStrategy(
		{
			passReqToCallback: true,
		},
		(req, username, password, cb) => {
			User.findOne({ username: username }, (err, user) => {
				if (err) return done(err);
				if (!user) {
					console.log("Usuario no encontrado " + username);
					return cb(null, false);
				}
				if (!validatePassword(user, password)) {
					console.log("Password invalido");
					return cb(null, false);
				}
				return cb(null, user);
			});
		}
	)
);

const validatePassword = (user, password) => {
	return bCrypt.compareSync(password, user.password);
};

passport.use("register", new LocalStrategy(
		{
			passReqToCallback: true,
		},
		function (req, username, password, cb) {
			const findOrCreateUser = function () {
				User.findOne({ username: username }, function (err, user) {
					if (err) {
						console.log("Error: " + err);
						return cb(err);
					}
					if (user) {
						console.log("Usuario existe");
						return cb(null, false);
					} else {
						let newUser = new User();
						newUser.username = username;
						newUser.password = createHash(password);
						newUser.save((err) => {
							if (err) {
								console.log("Error : " + err);
								throw err;
							}
							console.log("Usuario registrado");
							return cb(null, newUser);
						});
					}
				});
			};
			process.nextTick(findOrCreateUser);
		}
	)
);

let createHash = function (password) {
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};


passport.serializeUser((user, done) => {
	done(null, user._id);
});


passport.deserializeUser((id, done) => {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

app.get("/ses", (req, res) => {
	console.log(req.session);
	res.send("mira la consola");
});

app.post("/login",
	passport.authenticate("login", { failureRedirect: "/faillogin" }),
	(req, res) => {
		//cambie el '/' por '/login'
		res.redirect("/login");
	}
);

app.get("/faillogin", (req, res) => {
	res.render("login-error", {});
});


app.get("/register", (req, res) => {
	res.render("register");
});

app.post("/register", passport.authenticate("register",
 { failureRedirect: "/failregister" }),
	(req, res) => {
		res.redirect("/");
	}
);

app.get("/failregister", (req, res) => {
	res.render("register-error", {});
});


app.get("/logout", (req, res) => {
	const { username } = req.user;
	req.logout();
	res.render("logout", { username });
});

app.get("/login", (req, res) => {
	if (req.isAuthenticated()) {
		res.redirect("/");
	} else {
		res.render("login");
	}
});



app.get("/", (req, res) => {
	if (req.isAuthenticated()) {
		res.render("home", { username: req.user.username });
	} else {
		res.redirect("login");
	}
});



// const data = 
// app.get('/info', data)

// const content =
// app.get('/api/random', content)


// const PORT = process.env.PORT ?? 8080;

const PORT = args.p ?? 8080

//desafio 15

const FORK = args.FORK;
const CLUSTER = args.CLUSTER;

const runServer = (PORT) => {
    app.listen(PORT, () => console.log(`Servidor escuchando el puerto ${PORT}`));
}



if (CLUSTER) {
    if (cluster.isPrimary) {
        console.log(`Nodo primario ${process.pid} corriendo`);

        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on(`exit`, (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} finalizado`);
            cluster.fork();
        });

    } else {
        console.log(`Nodo Worker corriendo en el proceso ${process.pid}`);
        runServer(PORT);
    }

} else {
    runServer(PORT);
}