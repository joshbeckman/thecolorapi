
/*
 * Browser routing, for clients
 */
var fs = require('fs')
    , request = require('request')
    , config = JSON.parse(fs.readFileSync('./static/config.json'))
    , colored = require('../lib/colored')
    , schemer = require('../lib/schemer')
    , cutils = require('../lib/cutils')
    , newTime
    , response;

module.exports = function (app, ensureAuth) {
  app.get('/', function(req, res) {
    res.render('index', { title: config.name,
                          req: req 
                        });
  });

  app.post('/form-id', function(req,res){
    var err = null,
      color = colored.colorMe.apply(this,[cutils.parseUnknownType(req.body.color)]),
      topKeys = color ? Object.keys(color) : null,
      lowKeys = color ? (function(){
        var obj = {};
        for (var i = 0; i < topKeys.length; i++) {
          obj[topKeys[i]] = Object.keys(color[topKeys[i]]);
        }
        return obj;
      })() : null;
    if (color){
      res.redirect('/id?format=html&hex=' + color.hex.clean);
    } else {
      res.render('400', { color: req.body.color });
    }
  });
};