const mongoose = require('mongoose')

const submissionSchema = new mongoose.Schema(
  {
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
    submittedCode: { type: String, required: true },
    runtimeOutput: { type: String, default: '' },
    compilerStatus: { type: String, default: '' },
    techTeamReview: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    comments: { type: String, default: '' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
  },
  { timestamps: true },
)

const Submission = mongoose.model('Submission', submissionSchema)
module.exports = Submission
