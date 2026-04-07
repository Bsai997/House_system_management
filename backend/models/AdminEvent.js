const mongoose = require('mongoose');

const adminEventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
    },
    participationPoints: {
      type: Number,
      required: [true, 'Participation points are required'],
      min: 0,
    },
    winningPoints: {
      type: Number,
      required: [true, 'Winning points are required'],
      min: 0,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdminEvent', adminEventSchema);
