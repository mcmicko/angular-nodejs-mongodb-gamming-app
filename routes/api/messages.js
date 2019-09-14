const express = require('express');
const router = express.Router();
const roles = require('../../config/roles');
const allowOnly = require('./middleware/roleChecker').allowOnly;
const ObjectId = require('mongoose').Types.ObjectId;
const passport = require('passport');

// Load Models
const Message = require('../../models/Message');
const User = require('../../models/User');

// @route   POST api/messages/
// @desc    Send message to admins
// @access  Private(user, admin)

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  allowOnly(roles.accessLevels.user, (req, res) => {
    User.findOne({ role: 4 })
      .then(user => {
        if (user) {
          let messageFields = {};

          messageFields.messageContent = req.body.messageContent;
          messageFields.messageSender = req.body.messageSender;
          messageFields.comment = req.body.comment;
          messageFields.messageReciever = user._id;

          new Message(messageFields)
            .save()
            .then(message => {
              return res.status(200).json(message);
            })
            .catch(err => {
              return res.status(400).json({
                msg: 'There was an error sending a message',
                err: err
              });
            });
        }
      })
      .catch(err => {
        return res.status(404).json({
          msg: 'There was an error fetching users from database',
          err: err
        });
      });
  })
);

// @route   GET api/messages/
// @desc    Receive messages
// @access  Private(user, admin)

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  allowOnly(roles.accessLevels.admin, (req, res) => {
    Message.find()
      .populate('messageSender', ['userName'])
      .populate({
        path: 'comment',
        populate: [{ path: 'game' }, { path: 'user' }]
      })
      .then(messages => {
        if (messages === 0) {
          return res.status(200).json({
            msg: []
          });
        }
        return res.status(200).json(messages);
      })
      .catch(err => {
        return res.status(404).json({
          msg: 'There was an error fetching messages from database',
          err: err
        });
      });
  })
);

// @route   Delete api/messages/:messageId
// @desc    delete message
// @access  Private(user, admin)

router.delete(
  '/delete/:messageId',
  passport.authenticate('jwt', { session: false }),
  allowOnly(roles.accessLevels.admin, (req, res) => {
    Message.findByIdAndRemove({ _id: ObjectId(req.params.messageId) })
      .then(result => {
        if (result) {
          return res
            .status(200)
            .json({ msg: 'Message is successfuly removed' });
        }
        return res.status(200).json({ msg: 'This message does not exists' });
      })
      .catch(err => {
        return res.status(404).json({
          msg: 'There was an error fetching message from database',
          err: err
        });
      });
  })
);

module.exports = router;
