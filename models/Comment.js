const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: {
    type: String
  },
  commentDate: {
    type: Date,
    default: () => {
      return new Date();
    }
  },
  game: {
    type: Schema.Types.ObjectId,
    allowNull: false,
    required: true,
    ref: 'games'
  },
  user: {
    type: Schema.Types.ObjectId,
    allowNull: false,
    ref: 'users',
    required: true
  }
});

module.exports = Comment = mongoose.model('comments', commentSchema);
