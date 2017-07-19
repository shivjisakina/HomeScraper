// NPM requires
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const request = require('request');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

// Connecting to my MongoDB Database
mongoose.connect('mongodb://localhost/my_database');

// Making my port 3000 or process.env.PORT for heroku deployment
var PORT = process.env.PORT || 3000;

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

// cheerio npm package for backend jQuery
const $ = cheerio.load('<h2 class="title">Hello world</h2>');

// request npm package
request('http://www.google.com', function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
});

// Listening to the port
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
})