const mongoose = require('mongoose');

const participationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['registered', 'present', 'absent'],
      default: 'registered',
    },
    pointsAwarded: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate registrations
participationSchema.index({ eventId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Participation', participationSchema);
