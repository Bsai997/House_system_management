const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'House name is required'],
      unique: true,
      enum: ['Jal', 'Vayu', 'Agni', 'Akash', 'Prudhvi'],
    },
    logo: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#3B82F6',
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    teamLeadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    eventsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('House', houseSchema);
