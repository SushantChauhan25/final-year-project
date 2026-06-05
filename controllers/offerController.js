const User = require('../models/User')
const Offer = require('../models/Offer')
const { createOfferPdf } = require('../utils/pdfGenerator')
const { sendOfferEmail } = require('../utils/emailSender')

const createOffer = async (req, res, next) => {
  try {
    const { id } = req.params
    const { position, salary, joiningDate } = req.body

    if (!position || !salary || !joiningDate) {
      return res.status(400).json({ message: 'position, salary, and joiningDate are required' })
    }

    const candidate = await User.findById(id)
    if (!candidate || candidate.role !== 'candidate') {
      return res.status(404).json({ message: 'Candidate not found' })
    }

    if (candidate.applicationStatus !== 'tech_passed') {
      return res.status(400).json({ message: 'Candidate has not passed the technical round yet' })
    }

    const offerData = {
      candidateId: candidate._id,
      position,
      salary,
      joiningDate,
      pdfPath: '',
    }

    let pdfPath = ''
    try {
      pdfPath = await createOfferPdf({ candidate, offer: offerData })
    } catch (pdfErr) {
      console.warn('PDF generation failed:', pdfErr.message)
      pdfPath = 'pdf-generation-failed'
    }

    const offer = await Offer.create({ ...offerData, pdfPath, status: 'sent' })

    try {
      await sendOfferEmail({ candidate, offer, pdfPath })
    } catch (emailErr) {
      console.warn('Email delivery skipped:', emailErr.message)
    }

    candidate.applicationStatus = 'offer_sent'
    await candidate.save()

    res.status(201).json({ message: 'Offer letter generated and email dispatched', offer })
  } catch (err) {
    next(err)
  }
}

module.exports = { createOffer }
