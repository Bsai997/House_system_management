const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    points: {
      type: Number,
      required: true,
      min: 1,
    },
    activityType: {
      type: String,
      enum: ['bonus', 'penalty'],
      default: 'bonus',
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    houseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'House',
      required: true,
    },
  },
  { timestamps: true }
);

activitySchema.index({ studentId: 1 });
activitySchema.index({ houseId: 1 });

module.exports = mongoose.model('Activity', activitySchema);
