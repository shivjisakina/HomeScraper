var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true })

module.exports = function () {

    nightmare
        .goto('http://localhost:3000/scrape')
        .wait()
        .goto('http://localhost:3000/homes')
        .wait('#main')
        .evaluate(function () {
            return document.querySelector('#main .searchCenterMiddle li a').href
        })
        .end()
        .then(function (result) {
            console.log(result)
        })
        .catch(function (error) {
            console.error('Search failed:', error);
        });

}


