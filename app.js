const express = require('express');
const session = require('express-session');
const path = require('path');
var bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const mesg = require('mesg-js').application();

let db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the users database.');
});

const app = express();
const plivoAuthId = 'AUTHID HERE';
const plivoAuthToken = 'AUTH TOKEN HERE';
const sendgridAPIKey = 'API KEY HERE';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine' , 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('images'));
app.use(session({secret: "Very secret key"}));

app.get('/', function(req, res){
	if(req.session.username){
    res.render('/dashboard');
  }
	res.render('index');
});

app.get('/register', function(req, res){
	res.render('register');
});

app.post('/register', function(req, res){
	var password = req.body['password'];
	var re = req.body['retype-password'];
	if(password == re){
		db.run(`INSERT INTO users(name, email, username, password) VALUES(?, ?, ?, ?)`, [req.body['name'], req.body['email'], req.body['username'], req.body['password']], function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
		res.redirect('/login');
	}
	res.redirect('/register');
});

app.get('/login', function(req, res){
	res.render('login');
});

app.post('/login', function(req, res){
	db.get(`SELECT password from users WHERE username = ?`, [req.body['username']], (err,row) => {
	  if (err) {
		  console.log(err.message);
	  }

    if(row['password'] == req.body['password']){
		  req.session.username = req.body['username'];
			req.session.status = "logged";
 	  }
	});
	return res.redirect('/login');
});

app.get('/dashboard', function(req, res){
	res.render('dashboard');
});

app.listen(4000, function(){
	console.log('Server started on port 4000')
});
