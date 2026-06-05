const mongoose = require('mongoose')

const testSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    problemStatement: { type: String, required: true },
    sampleInput: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    languageId: { type: Number, required: true },
  },
  { timestamps: true },
)

const Test = mongoose.model('Test', testSchema)
module.exports = Test
