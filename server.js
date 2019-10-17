let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let morgan = require('morgan');
let mongoose = require('mongoose');
let port = process.env.PORT || 3000;

var jwt = require('jsonwebtoken');
var superSecrect = 'toihocmean';

const Deck = require('./app/models/deck');
const Card = require('./app/models/card');
const User = require('./app/models/user');

// Connect to database
let count = 0;
mongoose.Promise = global.Promise;

function connectDatabase() {
  mongoose.connect('mongodb://localhost:27017/flashcard', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    .then(() => {
      console.log('Connect to database successfully');
    })
    .catch((err) => {
      console.log(`Cannot connect to database. Try connecting after 5 seconds (${++count})`);
      setTimeout(connectDatabase, 5000);
    });
}

connectDatabase();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  next();

  //check the header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  //decode token
  // if (token) {
  //   //varifies secrect and checks rxp
  //   jwt.verify(token, superSecrect, function (err, decoded) {
  //     if (err) {
  //       return res.json({
  //         success: false,
  //         message: 'Failed to authenticate token.'
  //       });
  //     } else {
  //       //if everything is good, save to request for use it in other routes
  //       req.decoded = decoded;
  //       next();

  //     }
  //   });
  // } else {
  //   //if there is no token
  //   //return an http response of 403 (access forbidden) and an error message
  //   return res.status(403).send({
  //     success: false,
  //     message: 'No token privided.'
  //   });
  // }

});

//log all requests to the console
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

  Deck.findOne({
    name: 'Test'
  }).populate('deck').exec(function (err, deck) {
    if (err) {
      throw err;
    }

    res.json(deck);
  });
});

// Routing user
var apiRouter = express.Router();
app.use('/api', apiRouter);

//route to authenticate a user
apiRouter.post('/authenticate', function (req, res) {
  //find the user
  User.findOne({
    username: req.body.username
  }).select('name username password').exec(function (err, user) {
    if (err) throw err;

    //no user with that username was found
    if (!user) {
      res.json({
        success: false,
        message: 'Authentication failed. User not found.'
      });
    } else if (user) {
      //check if pass word mathes
      var validPassword = user.comparePassword(req.body.password);
      if (!validPassword) {
        res.json({
          success: false,
          message: 'Authentication failed. Wrong password.'
        });
      } else {
        //if user is found and password is right
        //create a token
        var token = jwt.sign({
          name: user.name,
          username: user.username
        }, superSecrect, {
          expiresIn: '365d' //expries in 24h
        });
        //return the information including token as json
        res.json({
          success: true,
          message: 'Here is your token',
          token: token
        });
      }
    }
  })
});

apiRouter.route('/users')
  .post(function (req, res) {
    //create user model
    var user = new User();
    user.name = req.body.name;
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;

    //save user & check error
    user.save(function (err) {
      if (err) {
        //duplicate entry
        if (err.code == 11000)
          return res.json({
            success: false,
            message: 'Username already exist'
          });
        else
          return res.send(err);
      }
      res.json({
        message: 'User created'
      });
    })
  })
  //get all user
  .get(function (req, res) {
    User.find(function (err, users) {
      if (err) return res.send(err);

      //return the users
      res.json(users);
    })
  });

apiRouter.route('/users/:user_id')
  //get the user with that id
  .get(function (req, res) {
    User.findById(req.params.user_id, function (err, user) {
      if (err) return res.send(err);
      //return that user
      res.json(user);
    })
  })
  //update the user with this id
  .put(function (req, res) {
    User.findById(req.params.user_id, function (err, user) {
      if (err) return res.send(err);
      //set the user info if it exists in the request
      if (req.body.name) user.name = req.body.name;
      //if (req.body.username) user.username = req.body.username;
      if (req.body.password) user.password = req.body.password;
      if (req.body.email) user.email = req.body.email;

      //save the user
      user.save(function (err) {
        if (err) return res.send(err);
        //return a message
        res.json({
          message: 'User updated'
        });
      });
    });
  })
  .delete(function (req, res) {
    User.deleteOne({
      _id: req.params.user_id
    }, function (err, user) {
      if (err) return res.send(err);

      res.json({
        message: 'Successfully deleted'
      });
    });
  });


app.listen(port);