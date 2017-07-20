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

var dbconnectstring =
    process.env.MONGODB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/HomeScraper';


// Connecting to my MongoDB Database
mongoose.connect(dbconnectstring, { useMongoClient: true });

// HEROKU DEPLOYMENT: mongodb://heroku_r139bwdx:bj9kalikgpg164vcpmqnqenbsf@ds055495.mlab.com:55495/heroku_r139bwdx

var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");

    mongoose.connection.db.listCollections().toArray(function (err, names) {
        if (err) {
            console.log(err);
        } else {
            console.log(names);
        }
    });

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
//var router = require('./controllers/controller.js');
//app.use('/', router);

app.get('/', function (req, res) {
    // Rendering index.handlebars
    res.render('index');
});

app.get('/scrape', function (req, res) {

    // storing the url in a variable for easy readability
    var url = "https://www.newhomesource.com/communityresults/market-80";

    // request npm package
    request(url, function (error, response, body) {

        //console.log('error:', error); // Print the error if one occurred
        //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        //console.log('body:', body); // Print the HTML of the homepage.

        // Storing the body in $ var for backend jQuery
        const $ = cheerio.load(body);

        // For each loop through the nhs_CommResItem class
        $(".nhs_CommResItem").each(function(i, element) {

            // Empty results object
            var result = {};

            // Calling out the information I need
            result.title = $(element).find(".nhs_paidCommunityTitle").text().trim();
            result.price = $(element).find(".nhs_Price").text().trim();
            result.address = $(element).find(".nhs_Location").children("p").text().trim();
            result.imageLink = $(element).find(".mainImage").children("img").attr("src").trim();

            //Console logging it to make sure Im getting the right info out
            //console.log(element)
            /*console.log("title", title);
             console.log("------");
             console.log("price", price);
             console.log("------");
             console.log("address", address);
             console.log("------");
             console.log("Image Link", imageLink);
             console.log("------");*/

            var entry = new Homes(result);

            entry.save(function(err, doc) {
                // Log any errors
                if (err) {
                    console.log(err);
                }
                // Or log the doc
                else {
                    console.log(doc);
                }
            }); // entry.save

        }); // $.each

    }); // request function

    res.send("NewHomeSource has been scraped! :)");

}); // router.get '/scrape'

app.get('/homes', function (req, res) {

    Homes.find({})

        .populate("note")

        .exec(function(error, doc) {
            // Log any errors
            if (error) {
                console.log(error);
            }
            // Or send the doc to the browser as a json object
            else {
                res.json(doc);
            }
        }); // .exec(function..

}); // router.post '/homes'


// Listening to the port
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});