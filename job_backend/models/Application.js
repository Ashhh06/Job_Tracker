const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Application must belong to a user'],
    },
    companyName: {
      type: String,
      required: [true, 'Please provide a company name'],
      trim: true,
      maxlength: [100, 'Company name cannot be more than 100 characters'],
    },
    jobTitle: {
      type: String,
      required: [true, 'Please provide a job title'],
      trim: true,
      maxlength: [100, 'Job title cannot be more than 100 characters'],
    },
    jobDescription: {
      type: String,
      trim: true,
      maxlength: [5000, 'Job description cannot be more than 5000 characters'],
    },
    applicationDate: {
      type: Date,
      required: [true, 'Please provide an application date'],
      default: Date.now,
    },
    status: {
      type: String,
      enum: {
        values: ['Applied', 'Interview', 'Offer', 'Rejected'],
        message: 'Status must be: Applied, Interview, Offer, or Rejected',
      },
      default: 'Applied',
    },
    salary: {
      type: Number,
      min: [0, 'Salary cannot be negative'],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, 'Location cannot be more than 100 characters'],
    },
    jobType: {
      type: String,
      enum: {
        values: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
        message: 'Job type must be: Full-time, Part-time, Contract, Internship, or Remote',
      },
    },
    source: {
      type: String,
      trim: true,
      maxlength: [100, 'Source cannot be more than 100 characters'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Notes cannot be more than 2000 characters'],
    },
    deadline: {
      type: Date,
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

//create index for faster queries
applicationSchema.index({ user: 1, applicationDate: -1 });
applicationSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Application', applicationSchema);