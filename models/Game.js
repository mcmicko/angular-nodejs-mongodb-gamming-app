const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    allowNull: false,
    ref: 'users',
    required: true
  },
  name: {
    type: String
  },
  storyline: {
    type: String
  },
  rating: {
    type: Number
  },
  cover: {
    type: Object
  },
  platforms: {
    type: Array
  },
  genres: {
    type: Array
  },
  first_release_date: {
    type: Date
  },
  url: {
    type: String
  },
  scheduleDate: {
    type: Date
  },
  ratings: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },

      rating: {
        type: Number
      }
    }
  ]
});

module.exports = Game = mongoose.model('games', GameSchema);
