
/**
 * Module dependencies.
 */

var express      = require('express')
  , bootstrap    = require('bootstrap3-stylus')
  , stylus       = require('stylus')
  , nib          = require('nib')
  , routes       = require('./routes')
  , http         = require('http')
  , path         = require('path')
  , favicon      = require('serve-favicon')
  , morgan       = require('morgan')
  , errorhandler = require('errorhandler')
  , bodyParser   = require('body-parser')
  , nconf        = require('nconf')
  , mongoose     = require('mongoose');

//
// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. A file located at 'path/to/config.json'
//
nconf.argv()
    .env()
    .file({ file: './config.json' });

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
app.use(favicon(__dirname + '/public/favicon.ico'));
//Register stylus
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  // Tiny, Short, Default
  app.use(morgan('short'));
  app.use(errorhandler());
}

//Add routes, in routes.js
routes.registerRoutes(app);

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
