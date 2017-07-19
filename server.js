// NPM requires
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const request = require('request');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

// Requiring models
var Note = require("./models/Note.js");
var Homes = require("./models/Homes.js");

// Making my port 3000 or process.env.PORT for heroku deployment
var PORT = process.env.PORT || 3000;

// Connecting to my MongoDB Database
mongoose.connect('mongodb://localhost/homeScraper', { useMongoClient: true });

// HEROKU DEPLOYMENT: mongodb://heroku_r139bwdx:bj9kalikgpg164vcpmqnqenbsf@ds055495.mlab.com:55495/heroku_r139bwdx

var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
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
app.use(express.static('app/public'));

// requiring my  controller js file
var router = require('./controllers/controller.js');
app.use('/', router);

// cheerio npm package for backend jQuery
const $ = cheerio.load('<h2 class="title">Hello world</h2>');


// Listening to the port
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
})