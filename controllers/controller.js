// NPM requires
const express = require('express');
const router = express.Router();
const request = require('request');
const cheerio = require('cheerio');

router.get('/', function (req, res) {

    // Rendering index.handlebars
    res.render('index')

}) // router.get '/'

router.get('/scrape', function (req, res) {

    // storing the url in a variable for easy readability
    var url = "https://www.newhomesource.com/communityresults/market-80";

// request npm package
    request(url, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML of the homepage.
    });

}) // router.get '/scrape'

router.post('/scrape', function (req, res) {

}) // router.post '/scrape'

module.exports = router;
