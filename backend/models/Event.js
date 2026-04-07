const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
    },
    poster: {
      type: String,
      default: '',
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    houseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'House',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'published', 'closed'],
      default: 'pending',
    },
    housePoints: {
      type: Number,
      required: [true, 'House points are required'],
      min: 0,
    },
    participationPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    winningPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    participationCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
