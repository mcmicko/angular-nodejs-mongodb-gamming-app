const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  messageContent: {
    type: String
  },

  messageSender: {
    type: Schema.Types.ObjectId,
    allowNull: false,
    ref: 'users',
    required: true
  },

  messageReciever: {
    type: Schema.Types.ObjectId,
    allowNull: false,
    ref: 'users',
    required: true
  },

  comment: {
    type: Schema.Types.ObjectId,
    allowNull: false,
    ref: 'comments',
    required: true
  },

  sendingDate: {
    type: Date,
    default: () => {
      return new Date();
    }
  }
});

module.exports = Message = mongoose.model('messages', messageSchema);
