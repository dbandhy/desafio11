const optionsSQLite3 = {
	client: 'sqlite3',
	connection: {
		filename: './db/products.sqlite'
	},
	useNullAsDefault: true
}

const optionsMariaDB = {
	client: 'mysql',
	connection: {
		host: '127.0.0.1',
		user: 'root',
		password: '',
		database: 'nuestra_primera_db'
	}
}

//No es necesario para que la db funcione
const mongodbConnection = "mongodb://localhost:27017"




module.exports = { optionsSQLite3, optionsMariaDB , mongodbConnection };