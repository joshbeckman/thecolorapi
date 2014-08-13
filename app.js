require('newrelic');
var express = require('express')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , config = JSON.parse(fs.readFileSync('./static/config.json'))
  , app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);
app.use(function(req, res, next){
  res.status(404);
  if (req.accepts('html')) {
    res.render('404', { url: req.url, title: '404 - '+config.name });
    return;
  }
  if (req.accepts('json')) {
    res.send(404, config.status['404']);
    return;
  }
  res.type('txt').send('404: Not found');
});
function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}
function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.send(500, config.status['500']);
  } else {
    next(err);
  }
}
function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}

// development only
app.configure('development', function(){
  app.use(express.errorHandler({ showStack: true }));
  var repl = require('repl').start('liverepl> ');
  // repl.context.io = io;
  // repl.context.Post = Post;
});

// Set up routes
require('./routes/frontEnd')(app, ensureAuth);
require('./routes/api')(app, ensureAuth);
function ensureAuth(req, res, next) {
  if(req.query.key && req.query.key == process.env.API_KEY) {return next();}
  res.send(403, config.status['403']);
}

http.createServer(app).listen(app.get('port'), function(){
  console.log(config.name + " server listening on port %d in %s mode", app.get('port'), app.settings.env);
});
