// NPM requires
const express = require('express');
const router = express.Router();
const request = require('request');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

// Requiring models
var Note = require("./../models/Note.js");
var Homes = require("./../models/Homes.js");

var db =
    process.env.MONGODB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/HomeScraper';

// Connecting to my MongoDB Database
mongoose.connect('mongodb://localhost:27017/HomeScraper', { useMongoClient: true });
mongoose.connect('mongodb://heroku_r139bwdx:bj9kalikgpg164vcpmqnqenbsf@ds055495.mlab.com:55495/heroku_r139bwdx', { useMongoClient: true });

mongoose.connect(db, function(err,res){

    if(err){
        console.log("Error connection to: " + db + '. ' + err);
    } else {
        console.log("Succeeded connecting to: " + db);
    }

});

mongoose.Promise = Promise;

router.get('/', function (req, res) {

    // Rendering index.handlebars
    res.render('index')

}); // router.get '/'

router.get('/scrape', function (req, res) {

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


router.post('/scrape', function (req, res) {
    

}); // router.post '/scrape'

router.get('/homes', function (req, res) {

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

router.post('/homes', function (req, res) {


}); // router.post '/homes'

router.get('/homes/:id', function (req, res) {

    Homes.findOne({ "_id": req.params.id })

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

router.post('/homes/:id', function (req, res) {


}); // router.post '/homes'

module.exports = router;
