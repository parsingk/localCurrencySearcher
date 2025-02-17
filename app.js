const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/robots.txt', express.static(path.join(__dirname, 'static/robots.txt')));
app.use('/.well-known/acme-challenge/:id', express.static(path.join(__dirname, 'static/wellknown.txt')));

app.use('/', (req, res, next) => {
  let host = req.headers.host;
  let protocol = req.headers['x-forwarded-proto'] || req.protocol;

  if(host !== 'localhost:3000') {
    if (host === 'gg-currency.kr' && protocol === 'https') {
        res.redirect("https://www." + host + req.url);
    } else if(protocol !== 'https') {
        res.redirect("https://" + host + req.url);
    } else {
        next();
    }
  } else {
    next();
  }
});

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
