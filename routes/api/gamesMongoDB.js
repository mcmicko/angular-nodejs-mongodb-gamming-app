const express = require('express');
const router = express.Router();
const roles = require('../../config/roles');
const allowOnly = require('./middleware/roleChecker').allowOnly;
const ObjectId = require('mongoose').Types.ObjectId;
const passport = require('passport');
const nodemailer = require('nodemailer');

//Load models
const Game = require('../../models/Game');

// @route   POST api/gamesMongoDB/
// @desc    Save game to mongoDB
// @access  Private(user, admin)
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  allowOnly(roles.accessLevels.user, (req, res) => {
    let gameFields = {};
    gameFields.name = req.body.name;
    gameFields.storyline = req.body.storyline;
    gameFields.rating = req.body.rating;
    gameFields.user = req.body.user;
    gameFields.cover = req.body.cover;
    gameFields.platforms = req.body.platforms;
    gameFields.genres = req.body.genres;
    gameFields.first_release_date = req.body.first_release_date * 1000;
    gameFields.url = req.body.url;
    gameFields.scheduleDate = req.body.scheduleDate;
    Game.findOne({ _id: ObjectId(req.body.gameId) }).then(game => {
      if (game) {
        Game.findOneAndUpdate(
          { _id: ObjectId(req.body.gameId) },
          { $set: gameFields },
          { new: true }
        )
          .then(game => {
            return res.status(200).json(game);
          })
          .catch(err => {
            return res.status(404).json({
              msg: 'There was an error updating a game',
              err: err
            });
          });
      } else {
        new Game(gameFields)
          .save()
          .then(game => {
            return res.status(200).json(game);
          })
          .catch(err => {
            return res.status(400).json({
              msg: 'There was an error saving new Game',
              err: err
            });
          });
      }
    });
  })
);

// @route   GET api/gamesMongoDB/
// @desc    Save game to mongoDB
// @access  Private(user, admin)
router.get(
  '/games',
  passport.authenticate('jwt', { session: false }),
  allowOnly(roles.accessLevels.user, (req, res) => {
    Game.find()
      .populate('user')
      .then(games => {
        if (games === 0) {
          return res.status(200).json({
            msg: []
          });
        }
        return res.status(200).json(games);
      })
      .catch(err => {
        return res.status(400).json({
          msg: 'There was an error fetching games from database',
          err: err
        });
      });
  })
);

// @route   GET api/gamesMongoDB/user/:userId
// @desc    Get games by userId
// @access  Private(user, admin)
router.get(
  '/user/:userId',
  passport.authenticate('jwt', { session: false }),
  allowOnly(roles.accessLevels.user, (req, res) => {
    Game.find({ user: ObjectId(req.params.userId) })
      .populate('user')
      .then(games => {
        if (games === 0) {
          return res.status(200).json({
            msg: []
          });
        }
        return res.status(200).json(games);
      })
      .catch(err => {
        return res.status(404).json({
          msg: 'There was an error fetching games from database',
          err: err
        });
      });
  })
);

// @route   Delete api/gamesMongoDB/:gameId
// @desc    Delete a game
// @access  Private(user, admin)
router.delete(
  '/:gameId',
  passport.authenticate('jwt', { session: false }),
  allowOnly(roles.accessLevels.user, (req, res) => {
    Game.findByIdAndRemove({ _id: ObjectId(req.params.gameId) })
      .then(result => {
        if (result) {
          return res
            .status(200)
            .json({ msg: 'The game is successfuly removed' });
        }
        return res.status(400).json({ msg: 'Game does not exits' });
      })
      .catch(err => {
        return res.status(404).json({
          msg: 'There was an error removing a game',
          err: err
        });
      });
  })
);

// @route   GET api/gamesMongoDB/search/:gameName
// @desc    Search games by name
// @access  Private(user, admin)

router.get(
  '/search/:gameName',
  passport.authenticate('jwt', { session: false }),
  allowOnly(roles.accessLevels.user, (req, res) => {
    Game.find({
      name: { $regex: '.*' + req.params.gameName + '.*', $options: 'i' }
    })
      .populate('user')
      .then(games => {
        if (games === 0) {
          return res.status(200).json({
            msg: []
          });
        }
        return res.status(200).json(games);
      })
      .catch(err => {
        return res.status(400).json({
          msg: 'There was an error fetching games from database',
          err: err
        });
      });
  })
);

// SCHEDULE
var transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '534b5efd052c33',
    pass: '87303451a8174c'
  }
});

router.post('/schedule/:gameId/:userId', (req, res) => {
  Game.findOne({ _id: ObjectId(req.params.gameId) })
    .then(game => {
      if (game) {
        game.scheduleDate = req.body.scheduleDate;

        game
          .save()
          .then(game => res.status(200).json(game))
          .catch(err => res.status(404).json({ error: err }));
      } else {
        return res.status(400).json({ msg: 'User does not exist' });
      }
    })
    .catch(err => {
      return res.status(404).json({
        msg: 'there was an error fetching games from database',
        err: err
      });
    });

  User.findOne({ _id: ObjectId(req.params.userId) }).then(user => {
    if (user) {
      let nameGame = req.body.nameGame;
      let mailOptions = {
        from: 'gameBook@ourapp.com',
        to: user.email,
        subject: `I'ts time to play ${nameGame}!`,
        html: `enjoy in playing ${nameGame}`
      };
      let date = req.body.scheduleDate;
      let schedule = new Date(date) - new Date();
      console.log(mailOptions);
      setTimeout(() => {
        transporter.sendMail(mailOptions, function(error, response) {
          if (error) {
            console.log(error);
            res.end('error');
          } else {
            console.log('message sent: ' + response.message);
            res.json({ msg: 'message is sent in your email' });
          }
        });
      }, schedule);
    }
  });
});

// @route   POST  api/gamesMongoDB/rate
// @desc    User to rate a game
// @access  Private(user, admin)

router.post(
  '/rate/:gameId',
  passport.authenticate('jwt', { session: false }),
  allowOnly(roles.accessLevels.user, (req, res) => {
    Game.findOne({
      _id: ObjectId(req.params.gameId)
    })
      .then(game => {
        if (game) {
          const newRating = {
            user: req.body.user,
            rating: req.body.rating
          };

          game.ratings.unshift(newRating);

          game.save().then(post => res.json(post));
        }
      })
      .catch(err => {
        return res.status(404).json({
          msg: 'There was an error fetching games from database',
          err: err
        });
      });
  })
);
module.exports = router;
