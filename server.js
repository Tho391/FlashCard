let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let morgan = require('morgan');
let mongoose = require('mongoose');
let port = process.env.PORT || 3000;
const Deck = require('./app/models/deck');
const Card = require('./app/models/card');

// Connect to database
let count = 0;
mongoose.Promise = global.Promise;

function connectDatabase() {
  mongoose.connect('mongodb://localhost:27017/flashcard', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
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

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  next();
});

app.use(morgan('dev'));

app.get('/', function (req, res) {
  res.send('Welcome to the home page!');
});

app.get('/test', function (req, res) {
  // let deck = new Deck({
  //   _id: new mongoose.Types.ObjectId(),
  //   name: 'Test',
  //   description: 'Some text here'
  // });

  // deck.save(function (err) {
  //   if (err) {
  //     throw err;
  //   }

  //   for (let i = 0; i < 3; i++) {
  //     let card = new Card({
  //       front: 'Go ' + i,
  //       back: 'Some text here ' + i,
  //       deck: deck._id
  //     });

  //     card.save(function (err1) {
  //       if (err1) {
  //         throw err1;
  //       }
  //     });
  //   }
  // });

  Deck.findOne({ name: 'Test' }).populate('deck').exec(function (err, deck) {
    if (err) {
      throw err;
    }

    res.json(deck);
  });
});

// Routing user
var apiRouter = express.Router();

app.listen(port);