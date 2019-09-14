const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const randomString = require('randomstring');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const mailer = require('../../misc/mailer');
const roles = require('../../config/roles');
const allowOnly = require('./middleware/roleChecker').allowOnly;
const ObjectId = require('mongoose').Types.ObjectId;
const multer = require('multer');

// Load models
const User = require('../../models/User');
const Game = require('../../models/Game');

// Load input validations
const validateRegisterInput = require('../../validations/registration');
const validateLogInInput = require('../../validations/login');
const validateUpdateProfileInput = require('../../validations/updateProfile');
const validateChangePasswordInput = require('../../validations/changePassword');

// Load html
const verifiedHtml = require('../../misc/htmlVerification');

// @route   POST api/users/register
// @desc    Register an User with token
// @access  Public

router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        errors.email = 'Email already exits';
        return res.status(400).json(errors);
      } else {
        User.findOne({ userName: req.body.userName })
          .then(user => {
            if (user) {
              errors.userName = 'This username is already exits';
              return res.status(400).json(errors);
            } else {
              // Create and save the user
              var newUser = new User({
                userName: req.body.userName,
                email: req.body.email,
                password: req.body.password
              });

              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) {
                    throw err;
                  }

                  // Generate secret token
                  const secretToken = randomString.generate();
                  newUser.secretToken = secretToken;

                  newUser.password = hash;
                  newUser
                    .save()
                    .then(user => {
                      return res.status(200).json(user);
                    })
                    .catch(err => {
                      return res.status(404).json({ error: err });
                    });

                  // Compose Email
                  const html =
                    'Hello,<br> Please Click on the link to verify your email.<br><a href=http://localhost:5000/api/users/verify/' +
                    newUser.secretToken +
                    '>Click here to verify</a>';

                  // Send Email
                  mailer
                    .sendEmail(
                      'no-reply@yourwebapplication.com',
                      'Please confirm your Email',
                      newUser.email,
                      html
                    )
                    .then((err, response) => {
                      if (err) {
                        console.log(err);
                        res.end('error');
                      } else {
                        console.log('Message sent: ' + response.message);
                        res.json({ msg: 'message is sent in your email' });
                      }
                    });
                });
              });
            }
          })
          .catch(err => {
            return res.status(404).json({ error: err });
          });
      }
    })
    .catch(err => {
      return res.status(404).json({ error: err });
    });
});

// @route   POST api/users/verify/:token
// @desc    Verify an User after registration
// @access  Public

router.get('/verify/:secretToken', (req, res) => {
  const secretToken = req.params.secretToken;

  User.findOne({ secretToken: secretToken })
    .then(user => {
      if (!user) {
        errors.secretToken = 'User not found';
        return res.status(400).json(errors);
      } else {
        user.isVerified = true;
        user.secretToken = '';

        user
          .save()
          .then(() => {
            return res.status(200).send(verifiedHtml);
          })
          .catch(err => {
            return res.status(404).json({ error: err });
          });
      }
    })
    .catch(err => {
      err.msg = 'There was an error fetching users from database';
      return res.status(404).json({ error: err });
    });
});

// @route   POST api/users/login
// @desc    Login an User
// @access  Public

router.post('/login', (req, res) => {
  const { errors, isValid } = validateLogInInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const userName = req.body.userName;
  const password = req.body.password;

  User.findOne({ userName: userName }).then(user => {
    if (!user) {
      errors.userName = 'User not found';
      return res.status(404).json(errors);
    }

    if (!user.isVerified) {
      errors.verify = 'You need to verify your email first';
      return res.status(400).json(errors);
    }

    if (user.blockedUntil >= Date.now()) {
      errors.blocked = `You are blocked until ${user.blockedUntil.toDateString()}`;
      return res.status(400).json(errors);
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user._id,
          name: user.userName,
          avatar: user.avatar
        };

        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 86400 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private(Users and Admins)
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  allowOnly(roles.accessLevels.user, (req, res) => {
    res.json({
      _id: req.user._id,
      userName: req.user.userName,
      email: req.user.email,
      role: req.user.role,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      hometown: req.user.hometown,
      imagePath: req.user.imagePath,
      dateOfBirth: req.user.dateOfBirth,
      country: req.user.country
    });
  })
);

// @route   POST api/users/CreateProfile/:userId
// @desc    Create a profile for user
// @access  Private (User, Admin)
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];

    if (isValid) {
      error = null;
    }
    cb(null, './routes/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(' ')
      .join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

const upload = multer({ storage: storage }).single('image');

router.post(
  '/updateProfile',
  upload,
  passport.authenticate('jwt', { session: false }),
  allowOnly(roles.accessLevels.user, (req, res, next) => {
    const { errors, isValid } = validateUpdateProfileInput(req.body);
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      imagePath = url + '/images/' + req.file.filename;
    }
    if (!isValid) {
      return res.status(400).json(errors);
    }
    console.log(req.file);
    let updateProfileFields = {};
    updateProfileFields.firstName = req.body.firstName;
    updateProfileFields.lastName = req.body.lastName;
    updateProfileFields.imagePath = imagePath;
    updateProfileFields.dateOfBirth = req.body.dateOfBirth;
    updateProfileFields.hometown = req.body.hometown;
    updateProfileFields.country = req.body.country;

    User.findByIdAndUpdate(
      { _id: ObjectId(req.body.userId) },
      { $set: updateProfileFields },
      { new: true }
    )
      .then(user => {
        return res.status(200).json(user);
      })
      .catch(err => {
        return res.status(404).json({
          msg: 'There was an error updating the profile'
        });
      });
  })
);

// @route   GET api/users/:userId
// @desc    Return the selected user
// @access  Private (User, Admin)

router.get(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  allowOnly(roles.accessLevels.user, (req, res) => {
    let errors = {};
    User.findOne({ _id: ObjectId(req.params.userId) })
      .then(user => {
        if (!user) {
          errors.no_user = 'The requested user does not exits';
          return res.status(400).json(errors);
        }
        return res.status(200).json(user);
      })
      .catch(err => {
        return res.status(404).json({
          msg: 'There was an error fetching user from database',
          err: err
        });
      });
  })
);

// @route   Delete api/users/:userId
// @desc    Delete the selected user
// @access  Private (Admin)

router.delete(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  allowOnly(roles.accessLevels.admin, (req, res) => {
    Game.deleteMany({ user: ObjectId(req.params.userId) })
      .then(() => {
        Comment.deleteMany({ user: ObjectId(req.params.userId) })
          .then(() =>
            User.findByIdAndRemove({ _id: ObjectId(req.params.userId) })
              .then(result => {
                if (result) {
                  return res
                    .status(200)
                    .json({ msg: 'User is successfuly removed' });
                }
                return res.status(400).json({ msg: 'User does not exists!' });
              })
              .catch(err => {
                return res.status(404).json({
                  msg: 'There was an error removing a user',
                  err: err
                });
              })
          )
          .catch(err => {
            return res.status(404).json({
              msg: 'There was an error removing comments',
              err: err
            });
          });
      })
      .catch(err => {
        return res.status(404).json({
          msg: 'There was an error removing games',
          err: err
        });
      });
  })
);

// @route   Post api/users/block/:userId
// @desc    Block user
// @access  Private (Admin)

router.post(
  '/block/:userId',
  passport.authenticate('jwt', { session: false }),
  allowOnly(roles.accessLevels.admin, (req, res) => {
    User.findOne({ _id: ObjectId(req.params.userId) })
      .then(user => {
        if (user) {
          user.blockedUntil = req.body.blockDate;

          user
            .save()
            .then(user => {
              return res.status(200).json(user);
            })
            .catch(err => {
              return res.status(404).json({ error: err });
            });
        } else {
          return res.status(400).json({ msg: 'User does not exits' });
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

// @route   Post api/users/
// @desc    Get the list of users
// @access  Private (Admin)

router.get(
  '/userList/:userId',
  passport.authenticate('jwt', { session: false }),
  allowOnly(roles.accessLevels.user, (req, res) => {
    User.find({ _id: { $ne: ObjectId(req.params.userId) }, isVerified: true })
      .then(users => {
        if (users.length === 0) {
          errors.no_users = 'There are no verified users';
          return res.status(400).json(errors);
        }
        return res.status(200).json(users);
      })
      .catch(err => {
        return res.status(404).json({
          msg: 'There was an error fetching users from database',
          err: err
        });
      });
  })
);

// @routes  POST api/users/resetPassword
// @desc    reset the password by user
// @access  Public

router.post('/requestPasswordReset', (req, res) => {
  let errors = {};
  User.findOne({ email: req.body.userEmail })
    .then(user => {
      if (user) {
        // Compose Email
        const html =
          'Hello,<br> Please Click on the link to verify your email.<br><a href=http://localhost:4200/reset-password <a>Click here to reset your password</a>';

        // Send Email
        mailer
          .sendEmail(
            'no-reply@yourwebapplication.com',
            'Password reset',
            req.body.userEmail,
            html
          )
          .then(response => {
            console.log('Message sent: ' + response.message);
            res.json({ msg: 'message is sent to your email address' });
          })
          .catch(err => {
            return res.status(404).json({
              msg: 'There was a problem with sending the mail',
              err: err
            });
          });
      } else {
        errors.userNotFound = 'User not found';
        return res.status(404).json(errors);
      }
    })
    .catch(err => {
      return res.status(404).json({
        msg: 'There was a problem fetching users from the database',
        err: err
      });
    });
});

// @route   SET api/users/changePassword
// @desc    Create new uers password
// @access  Public

router.post('/changePassword', (req, res) => {
  const { errors, isValid } = validateChangePasswordInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ userName: req.body.userName })
    .then(user => {
      if (user) {
        user.password = req.body.password;

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
              throw err;
            }

            user.password = hash;
            user
              .save()
              .then(user => {
                return res.status(200).json(user);
              })
              .catch(err => {
                return res.status(404).json({ error: err });
              });
          });
        });
      } else {
        errors.password = 'User does not exist';
        return res.status(400).json(errors);
      }
    })
    .catch(err => {
      return res.status(404).json({
        msg: 'There was a problem fetching users from the database',
        err: err
      });
    });
});

module.exports = router;
