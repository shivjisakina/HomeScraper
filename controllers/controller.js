// NPM requires
const express = require('express');
const router = express.Router();
const request = require('request');
const cheerio = require('cheerio');

router.get('/', function (req, res) {

    // Rendering index.handlebars
    res.render('index')

}) // router.get '/'

module.exports = router;
