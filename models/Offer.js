const mongoose = require('mongoose')

const offerSchema = new mongoose.Schema(
  {
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    position: { type: String, required: true },
    salary: { type: String, required: true },
    joiningDate: { type: Date, required: true },
    pdfPath: { type: String, required: true },
    status: { type: String, enum: ['pending', 'sent'], default: 'pending' },
  },
  { timestamps: true },
)

const Offer = mongoose.model('Offer', offerSchema)
module.exports = Offer
