
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
const cors=require('cors');
var users = require('./routes/users');
const passport = require('passport');
var passportRoute = require('./routes/passportRoute');
const mongoose=require('mongoose');
var port = 3000;
const config=require('./config/database');

//database connection
mongoose.connect(config.database);

//on connection
mongoose.connection.on('connected',()=>{
    console.log('Connected to data base successfully'+config.database);
});

//on database error
mongoose.connection.on('error',(eror)=>{
    console.log('Database eror'+eror);t
});
var app = express();

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
// Body Parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);
app.use('/passport', passportRoute);
app.use('/users', users);
app.get('*', function(req, res) {
		 res.sendFile(path.join(__dirname, 'public/index.html'));
	});

app.get('/callback', function(req,res){
    console.log('call back')
    res.redirect('/register');
});
app.listen(port, function(){
    console.log('Server started on port '+port);
});