const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit')

const createOfferPdf = async ({ candidate, offer }) => {
  const offersDirectory = path.join(__dirname, '..', 'offers')
  if (!fs.existsSync(offersDirectory)) {
    fs.mkdirSync(offersDirectory, { recursive: true })
  }

  const fileName = `offer-${candidate._id}-${Date.now()}.pdf`
  const pdfPath = path.join(offersDirectory, fileName)
  const doc = new PDFDocument({ size: 'A4', margin: 50 })

  doc.pipe(fs.createWriteStream(pdfPath))

  doc.fontSize(20).text('Offer Letter', { align: 'center' })
  doc.moveDown()
  doc.fontSize(12).text(`Dear ${candidate.name},`)
  doc.moveDown()
  doc.text(`We are pleased to offer you the position of ${offer.position}.`) 
  doc.text(`Start Date: ${new Date(offer.joiningDate).toDateString()}`)
  doc.text(`Annual Salary: ${offer.salary}`)
  doc.moveDown()
  doc.text('Please review the offer and confirm your acceptance. We look forward to welcoming you to the team.')
  doc.moveDown(2)
  doc.text('Sincerely,')
  doc.text('Recruitment Team')
  doc.end()

  return pdfPath
}

module.exports = { createOfferPdf }
