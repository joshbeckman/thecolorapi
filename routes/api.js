
/*
 * API routing
 */

var fs = require('fs')
    , request = require('request')
    , config = JSON.parse(fs.readFileSync('./static/config.json'))
    , colored = require('../lib/colored')
    , newTime
    , response;

module.exports = function (app, ensureAuth) {

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
    } else {
      res.jsonp(colored.colorMe.apply(this,[parseQueryColors(req.query)]));
    }
  });

  app.get('/random', function(req,res){
    var err = null;
    res.redirect('/id?hex=' + getRandomHex().substring(1));
  });

  app.get('/scheme', function(req,res){
    var err = null,
      mode = req.query.mode || 'monochrome',
      count = req.query.count || 5,
      color, 
      colors = [];
    if (!req.query.rgb && !req.query.hex && !req.query.hsl && !req.query.cmyk) {
      err = config.status['400'];
      err.message = 'The Color API doesn\'t understand what you mean. Please supply a query parameter of `rgb`, `hsl`, `cmyk` or `hex`.'
      err.query = req.query;
      err.params = req.params;
      err.path = req.path;
      err.example = '/scheme?hex=FF0&mode=monochrome&count=5';
      res.jsonp(err);
    } else {
      color = colored.colorMe.apply(this,[parseQueryColors(req.query)]);
      for (var i = count - 1; i >= 0; i--) {
        colors.push(color);
      }
      res.jsonp(colored.schemer.scheme.generate(mode, colors, color));
    }
  })

  function parseQueryColors(q){
    var hsl = {h:null,s:null,l:null},
      rgb = {r:null,g:null,b:null},
      cmyk = {c:null,m:null,y:null,k:null},
      hsv = {h:null,s:null,v:null},
      hex = q.hex ? q.hex : null;
    return {
      hsl:  maybeSplitParen(q.hsl, hsl),
      rgb:  maybeSplitParen(q.rgb, rgb),
      cmyk: maybeSplitParen(q.cmyk, cmyk),
      hsv:  maybeSplitParen(q.hsv, hsv),
      hex:  hex
    };
    function maybeSplitParen(str, obj){
      if(str){
        var s = str.split('('),
          k = Object.keys(obj);
        if(s.length > 1){
          s = s[1].split(')')[0].split(',');
        } else {
          s = s[0].split(',');
        }
        for (var i = 0; i < s.length; i++) {
          if(s[i].split('.').length > 1){
            obj[k[i]] = parseFloat(s[i]);
            obj.is_fraction = true;
          } else{
            obj[k[i]] = parseInt(s[i], 10);
          }
        }
      }
      return obj;
    }
  }

  function getRandomHex() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

};