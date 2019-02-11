const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine' , 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('images'));

app.get('/', function(req, res){
	res.render('index');
});

app.get('/register', function(req, res){
	res.render('register');
});

app.get('/login', function(req, res){
	res.render('login');
});

app.get('/dashboard', function(req, res){
	res.render('dashboard');
});

app.listen(4000, function(){
	console.log('Server started on port 4000')
});
