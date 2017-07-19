// NPM requires
const express = require('express');
const router = express.Router();
const request = require('request');
const cheerio = require('cheerio');
const mongoose = require('mongoose')

// Requiring models
var Note = require("./../models/Note.js");
var Homes = require("./../models/Note.js");

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

        $(".nhs_CommResItem").each(function(i, element) {

            var title = $(element).find(".nhs_paidCommunityTitle").text().trim();
            var price = $(element).find(".nhs_Price").text().trim();
            var address = $(element).find(".nhs_Location").children("p").text().trim();
            //var imageLink = $(element).find("div").children().children("img").text;
            var imageLink = $(element).find(".mainImage").children("img").attr("src").trim();
            //var topic = $(element).find(".TopicName.TopicNameSpan").text();
            //var text = $(element).find(".qtext_para").text();

            //console.log(element)
            console.log("title", title);
            console.log("------");
            console.log("price", price);
            console.log("------");
            console.log("address", address);
            console.log("------");
            console.log("Image Link", imageLink);
            console.log("------");
            //console.log(topic);
            //console.log(text);

        }); // $.each

    }); // request function

    res.send("Scrape Complete");

}); // router.get '/scrape'



router.post('/scrape', function (req, res) {
    

}) // router.post '/scrape'

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
        });

}) // router.post '/homes'

module.exports = router;
