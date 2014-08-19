
/*
 * API routing
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

  app.get('/colorbox', function(req, res) {
    var color = colored.colorMe.apply(this,[cutils.parseUnknownType(req.query.c)]);
    res.render('colorSVG', { color: color.hex.value,
                              width: req.query.w || 100,
                              height: req.query.h || 100,
                              text: color.name.value,
                              contrast: color.contrast.value,
                              named: req.query.named
                            });
  });

  app.get('/schemebox', function(req, res) {
    var color = colored.colorMe.apply(this,[cutils.parseUnknownType(req.query.c)]);
    var scheme = schemer.getScheme((req.query.mode || 'monochrome'), (req.query.count || 5), color);
    res.render('schemeSVG', { scheme: scheme,
                              width: req.query.w || 100,
                              height: req.query.h || 200,
                              iter: 0,
                              section: Math.round((req.query.h || 200)/scheme.colors.length),
                              named: req.query.named
                            });
  });

  app.get('/id', function(req,res){
    var err = null;
    if (!req.query.rgb && !req.query.hex && !req.query.hsl && !req.query.cmyk) {
      err = config.status['400'];
      err.message = 'The Color API doesn\'t understand what you mean. Please supply a query parameter of `rgb`, `hsl`, `cmyk` or `hex`.'
      err.query = req.query;
      err.params = req.params;
      err.path = req.path;
      err.example = '/id?hex=a674D3';
      res.jsonp(err);
    } else if (req.query.format == 'html') {
      var err = null,
        color = colored.colorMe.apply(this,[cutils.parseQueryColors(req.query)]),
        topKeys = color ? Object.keys(color) : null,
        lowKeys = color ? (function(){
          var obj = {};
          for (var i = 0; i < topKeys.length; i++) {
            obj[topKeys[i]] = Object.keys(color[topKeys[i]]);
          }
          return obj;
        })() : null;
      if (color){
        res.render('formResults', { title: color.name.value + ' | The Color API',
                                    color: color,
                                    topKeys: topKeys,
                                    lowKeys: lowKeys
                                  });
      } else {
        res.render('400', { color: req.query.hex || req.query.rgb || req.query.hsl || req.query.cmyk });
      }
    } else {
      res.jsonp(colored.colorMe.apply(this,[cutils.parseQueryColors(req.query)]));
    }
  });

  app.get('/scheme', function(req,res){
    var err = null,
      mode = req.query.mode || 'monochrome',
      count = req.query.count || 5,
      color, 
      colors = [];
    if (!req.query.rgb && !req.query.hex && !req.query.hsl && !req.query.cmyk && count < 20 && count > 0) {
      err = config.status['400'];
      err.message = 'The Color API doesn\'t understand what you mean. Please supply a query parameter of `rgb`, `hsl`, `cmyk` or `hex`.'
      err.query = req.query;
      err.params = req.params;
      err.path = req.path;
      err.example = '/scheme?hex=FF0&mode=monochrome&count=5';
      res.jsonp(err);
    } else if (req.query.format == 'html') {
      color = colored.colorMe.apply(this,[cutils.parseQueryColors(req.query)]);
      var scheme = schemer.getScheme(mode, count, color);
      res.render('schemeResults', { title: color.name.value + ', ' + mode + ' | The Color API',
                                    scheme: scheme
                                  });
    } else {
      color = colored.colorMe.apply(this,[cutils.parseQueryColors(req.query)]);
      res.jsonp(schemer.getScheme(mode, count, color));
    }
  });

  app.get('/random', function(req,res){
    var err = null;
    res.redirect('/id?hex=' + cutils.getRandomHex().substring(1));
  });
};