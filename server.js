// NPM requires
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const request = require('request');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true })

// Requiring nightmaretest
var nightmareTest = require("./nightmare.js");
//nightmareTest();

// Requiring models
var Note = require("./models/Note.js");
var Homes = require("./models/Homes.js");

// Making my port 3000 or process.env.PORT for heroku deployment
var PORT = process.env.PORT || 3000;

var db =
    process.env.MONGODB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/HomeScraper';

// Connecting to my MongoDB Database
//mongoose.connect(dbconnectstring, { useMongoClient: true });

// HEROKU DEPLOYMENT: mongodb://heroku_r139bwdx:bj9kalikgpg164vcpmqnqenbsf@ds055495.mlab.com:55495/heroku_r139bwdx

mongoose.connect(db, function(err,res){
    if(err){
        console.log("Error connection to: " + db + '. ' + err);
    } else {
        console.log("Succeeded connecting to: " + db);
    }
});

// express npm package
var app = express();

// express-handlebars npm package
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// body-parser npm package
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.text());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

// Use all of the static files in the public folder
app.use(express.static('public'));

// requiring my  controller js file
var router = require('./controllers/controller.js');
app.use('/', router);

// Listening to the port
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});