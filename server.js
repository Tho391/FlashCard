const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const database = require('./config/database');
const UsersRoute = require('./app/routes/usersRoute');

// Connect to database
let count = 0;
mongoose.Promise = global.Promise;

function connectDatabase() {
  mongoose.connect(database.url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
      console.log('Connect to database successfully');
    })
    .catch((err) => {
      console.log(`Cannot connect to database. Try connecting after 5 seconds (${++count})`);
      setTimeout(connectDatabase, 5000);
    });
}

connectDatabase();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

// Route api

let apiRouter = express.Router();

require('./app/middlewares/setHeaders')(app);
require('./app/routes/loginRoute')(apiRouter);
UsersRoute.createUserRoute(apiRouter);

require('./app/middlewares/authenticate')(apiRouter);

UsersRoute.manipulateUserRoute(apiRouter);
require('./app/routes/decksRoute')(apiRouter);
require('./app/routes/cardsRoute')(apiRouter);

app.use('/api', apiRouter);

app.listen(port);
console.log('App listening on port ' + port);