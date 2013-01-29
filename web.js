var express = require('express'),
  app = express(),
  expressValidator = require('express-validator'),
  web = require('./routers/web.js'),
  api = require('./routers/api.js'),
  adm = require('./routers/adm.js'),
  jade = require('jade');

app.configure(function() {
  app.use('/static', express.static(__dirname + '/static'));
  app.use(express.bodyParser());
  app.use(expressValidator);
  app.use(express.logger());
});

app.engine('.jade', jade.__express);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

web(app);
api(app);
adm(app);

module.exports = app;
