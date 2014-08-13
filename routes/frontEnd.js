
/*
 * Browser routing, for clients
 */
var fs = require('fs')
    , config = JSON.parse(fs.readFileSync('./static/config.json'));

module.exports = function (app, ensureAuth) {
  app.get('/', function(req, res) {
    res.render('index', { title: config.name,
                          req: req 
                        });
  });
};