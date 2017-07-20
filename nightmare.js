var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true })

module.exports = function () {

    nightmare
        .goto('http://localhost:3000/')
        .wait(1000)
        .goto('http://localhost:3000/scrape')
        .wait(1000)
        .goto('http://localhost:3000/homes')
        .wait(1000)
        .goto('http://localhost:3000/homes/5970112d2b65ee1c4c478a38 ')
        .wait(3000)
        .end()
        .then(function (result) {
            console.log(result)
        })
        .catch(function (error) {
            console.error('Search failed:', error);
        });

}


