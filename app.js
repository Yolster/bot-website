var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cookies = require('cookies');
var settings = require('./settings.json') 
var bodyParser = require('body-parser')

var bot = require('./bot.js');
var indexRouter = require('./routes/index');
var dashboardRouter = require('./routes/dashboard');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:false}))
app.use(logger('dev'));
app.use(express.json());
app.use(cookies.express(['some','random','keys']))
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;