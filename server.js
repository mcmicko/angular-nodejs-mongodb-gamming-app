const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const path = require('path');

const users = require('./routes/api/users');
const games = require('./routes/api/games');
const gamesMongoDB = require('./routes/api/gamesMongoDB');
const filters = require('./routes/api/filters');
const comments = require('./routes/api/comments');

const messages = require('./routes/api/messages');

const app = express();
app.use(cors({ origin: 'http://localhost:4200' }));
app.use('/images', express.static(path.join('routes/images')));

app.get('/', (req, res) => res.send('Hello'));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to Database
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log('MondoDB Connected');
  })
  .catch(err => {
    console.log(err);
  });

// Passport Middlware
app.use(passport.initialize());

//Passpoert Config
require('./config/passport')(passport);

// Use routes
app.use('/api/users', users);
app.use('/api/gamesMongoDB', gamesMongoDB);
app.use('/api/games', games);
app.use('/api/platforms', filters);
app.use('/api/comments', comments);
app.use('/api/messages', messages);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
