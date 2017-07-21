// NPM requires
const express = require('express');
const router = express.Router();
const request = require('request');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

// Requiring models
var Note = require("./../models/Note.js");
var Homes = require("./../models/Homes.js");

router.get('/', function (req, res) {

    Homes.find({})

        .populate("note")

        .exec(function(error, doc) {
            // Log any errors
            if (error) {
                console.log(error);
            }
            // Or send the doc to the browser as a json object
            else {
                var data = {data: doc};
                //console.log(data);
                res.render('index', data);
            }
        }); // .exec(function..

    // Rendering index.handlebars

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
            result.imageLink = $(element).find(".mainImage").children("img").attr("src");

            var entry = new Homes(result);

            entry.save(function(err, doc) {
                // Log any errors
                if (err) {
                    console.log(err);
                }
                // Or log the doc
                else {
                    //console.log(doc);
                }
            }); // entry.save

        }); // $.each

    }); // request function

    res.send("NewHomeSource has been scraped! :)");

}); // router.get '/scrape'

router.get('/homes', function (req, res) {


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

    console.log("req.body", req.body)
    console.log("req.params.id", req.params.id)

    // Create a new note and pass the req.body to the entry
    var newNote = new Note(req.body);

    // And save the new note the db
    newNote.save(function(error, doc) {
        // Log any errors
        if (error) {
            console.log(error);
        }
        // Otherwise
        else {
            // Use the article id to find and update it's note
            Homes.findOneAndUpdate({ "_id": req.params.id }, {$push: { "note": doc._id}})
            // Execute the above query
                .exec(function(err, doc) {
                    // Log any errors
                    if (err) {
                        console.log(err);
                    }
                    else {
                        // Or send the document to the browser
                        res.send(doc);
                    }
                });
        }
    });


}); // router.post '/homes'

module.exports = router;
