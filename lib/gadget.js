var request = require('request');

function Gadget(id, host){
  this.id = id;
  this.host = host;
}

Gadget.prototype.collectPageview = function(req, cb) {
  var url = ['http://www.google-analytics.com/collect?v=1&tid=', this.id, '&cid=', req.ip, '&uip=', req.ip, '&t=pageview&dp=', encodeURIComponent(req.path), '&dh=', this.host, '&dt=ID&dl=', encodeURIComponent((req.host || this.host) + req.originalUrl)].join('');
  request(url, function (err, resp, body){
    if (err){
      console.log(err);
    }
    if (cb){
      cb(err, resp);
    }
  });
};

module.exports = Gadget;