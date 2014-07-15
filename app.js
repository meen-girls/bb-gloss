
/**
 * Module dependencies.
 */

var express = require('express')
  , exphbs  = require('express3-handlebars')
  , bootstrap = require('bootstrap3-stylus')
  , stylus = require('stylus')
  , nib = require('nib')
  , router = require('./router')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose');

// connect to db (hosted on mongo labs)
mongoose.connect('mongodb://test:test@ds043467.mongolab.com:43467/bb-tit');

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('compress', true)
    .use(nib())
    .use(bootstrap());
}


var app = express();

// all environments
var opts = require("nomnom")
   .option('sock', {
      abbr: 's',
      help: 'A socket'
   })
   .parse();
app.set('port', process.env.PORT || 3000);
app.set('socket', process.env.PORT || opts.sock);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.use(express.favicon());
app.use(express.logger('dev'));
//Register stylus
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Add routes, in routes.js
router.registerRoutes(app);
// remove previous socket before continuing start-up
if (app.get('socket')) {
  try {
    require('fs').unlinkSync(app.get('socket'));
  } catch(err) {
    // suppress ENOENT error as it simply means the sock didn't previously exist
    if (err.code !== 'ENOENT') {
      console.warn(err);
    }
  }
}

http.createServer(app).listen(app.get('socket') || app.get('port'), '0.0.0.0', function(){
  console.log('Express server listening on port ' + (app.get('socket') || app.get('port')));
});
