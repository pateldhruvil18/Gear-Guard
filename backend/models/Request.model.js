import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      default: null,
    },
    equipmentName: {
      type: String,
      trim: true,
      default: null,
    },
    type: {
      type: String,
      enum: ['corrective', 'preventive'],
      required: [true, 'Request type is required'],
    },
    scheduledDate: {
      type: Date,
      required: [true, 'Scheduled date is required'],
    },
    duration: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'assigned', 'in-progress', 'repaired', 'scrap'],
      default: 'pending',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    maintenanceTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    assignedTechnician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    pendingEdit: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    editApprovalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: null,
    },
    technicianDescription: {
      type: String,
      trim: true,
      default: null,
    },
    userFeedback: {
      type: String,
      trim: true,
      default: null,
    },
    feedbackRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
requestSchema.index({ equipment: 1, status: 1 });
requestSchema.index({ scheduledDate: 1 });
requestSchema.index({ status: 1 });

const Request = mongoose.model('Request', requestSchema);

export default Request;


