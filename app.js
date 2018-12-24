// 引用模組
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var compileSass = require('express-compile-sass');
var mongoose = require('mongoose');

// 建立app物件
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// sass setup
app.use(compileSass({
    root: path.join(__dirname, 'public'),
    sourceMap: true, 
    sourceComments: true,
    watchFiles: true, 
    logToConsole: false 
}));

// 設置靜態資源來源
app.use(express.static(path.join(__dirname, 'public')));

// 路由設置
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var registerRouter = require('./routes/register');
var postRouter = require('./routes/post');
var productRouter = require('./routes/product');
var memberRouter = require('./routes/member');
var checkoutRouter = require('./routes/checkout');
var categoryRouter = require('./routes/category');
var searchRouter = require('./routes/search');
var sellerRouter = require('./routes/seller');
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/register', registerRouter);
app.use('/post', postRouter);
app.use('/product', productRouter);
app.use('/member', memberRouter);
app.use('/checkout', checkoutRouter);
app.use('/category', categoryRouter);
app.use('/search', searchRouter);
app.use('/seller', sellerRouter);

// mongoose setup
mongoose.connect('mongodb://admin:fort4nite9@ds155862.mlab.com:55862/shopee');
// get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
// declare db for moogoose connection
var db = mongoose.connection
// bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function(){console.log("Database Connected.")});

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