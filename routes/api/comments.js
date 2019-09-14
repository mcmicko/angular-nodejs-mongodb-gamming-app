const express = require('express');
const router = express.Router();
const roles = require('../../config/roles');
const allowOnly = require('./middleware/roleChecker').allowOnly;
const ObjectId = require('mongoose').Types.ObjectId;
const passport = require('passport');

// Load models

const Comment = require('../../models/Comment');

// @route   POST api/comments/
// @desc    Post a comment to the game
// @access  Private(user, admin)

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  allowOnly(roles.accessLevels.user, (req, res) => {
    let commentsFields = {};

    commentsFields.content = req.body.content;
    commentsFields.user = req.body.userId;
    commentsFields.game = req.body.gameId;

    Comment.findOne({ _id: ObjectId(req.body.commentId) })
      .then(comment => {
        if (comment) {
          Comment.findOneAndUpdate(
            { _id: ObjectId(req.body.commentId) },
            { $set: commentsFields },
            { new: true }
          )
            .then(comment => {
              return res.status(200).json(comment);
            })
            .catch(err => {
              return res.status(404).json({
                msg: 'There was an error updating a comment',
                err: err
              });
            });
        } else {
          new Comment(commentsFields)
            .save()
            .then(comment => {
              return res.status(200).json(comment);
            })
            .catch(err => {
              return res.status(400).json({
                msg: 'There was an error saving a comment',
                err: err
              });
            });
        }
      })
      .catch(err => {
        return res.status(404).json({
          msg: 'There was an error fetching comments from database',
          err: err
        });
      });
  })
);

// @route   Get api/comments/game/:gameId
// @desc    Get comments for the selected game
// @access  Private(user, admin)

router.get(
  '/game/:gameId',
  passport.authenticate('jwt', { session: false }),
  allowOnly(roles.accessLevels.user, (req, res) => {
    Comment.find({ game: ObjectId(req.params.gameId) })
      .populate('user', ['userName'])
      .then(comments => {
        if (comments === 0) {
          return res.status(200).json({
            msg: []
          });
        }
        return res.status(200).json(comments);
      })
      .catch(err => {
        return res.status(404).json({
          msg: 'There was an error fetching comments from database',
          err: err
        });
      });
  })
);

// @route   DELETE api/comments/:commentId
// @desc    Get comments for the selected game
// @access  Private(user, admin)

router.delete(
  '/:commentId',
  passport.authenticate('jwt', { session: false }),
  allowOnly(roles.accessLevels.admin, (req, res) => {
    Comment.findByIdAndRemove({ _id: ObjectId(req.params.commentId) })
      .then(result => {
        if (result) {
          return res
            .status(200)
            .json({ msg: 'Comment is successfuly removed' });
        }
        return res.status(400).json({ msg: 'Comment does not exists' });
      })
      .catch(err => {
        return res.status(404).json({
          msg: 'There was an error fetching comments from database',
          err: err
        });
      });
  })
);

module.exports = router;
