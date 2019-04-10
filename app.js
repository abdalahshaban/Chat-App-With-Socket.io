var createError = require('http-errors');
var express = require('express');
var path = require('path');
const app = express();
const pug = require('pug');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server)

let users = [];

const port = 3000;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//socket.io connect
io.sockets.on('connection', (socket) => {
  //set username
  socket.on('set user', (data, callback) => {
    if (users.indexOf(data) != -1) {
      callback(false);
    } else {
      callback(true);
      socket.username = data
      users.push(socket.username);
      updateUsers();
    }
  });

  socket.on('send message', (data) => {
    io.sockets.emit('show message', {
      msg: data,
      user: socket.username
    })
  })

  socket.on('disconnect', (data) => {
    if (!socket.username) return;
    users.splice(users.indexOf(socket.username), 1)
    updateUsers();
  });

  function updateUsers() {
    io.sockets.emit('users', users);
  }

});




app.get('/', (req, res, next) => {
  res.render('index')
})

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.get('/', (req, res, next) => {
  res.render('index')
})


server.listen(port, () => {
  console.log('server started on port ' + port)
})




module.exports = app;