const sendOfferEmail = async ({ candidate, offer, pdfPath }) => {
  console.log(`[DUMMY EMAIL] Offer sent to ${candidate.email}`)
  console.log(`[DUMMY EMAIL] Subject: Offer Letter for ${offer.position}`)
  console.log(`[DUMMY EMAIL] PDF attached: ${pdfPath}`)
  return {
    messageId: `dummy-${Date.now()}`,
    status: 'success',
    message: 'Offer email simulated (no actual email sent)',
  }
}

module.exports = { sendOfferEmail }
