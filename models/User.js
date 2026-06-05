const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const profileSchema = new mongoose.Schema({
  headline: { type: String, default: '' },
  bio: { type: String, default: '' },
  skills: { type: [String], default: [] },
  experience: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
})

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, required: true, enum: ['candidate', 'hr', 'tech', 'admin'], default: 'candidate' },
    profile: { type: profileSchema, default: () => ({}) },
    resumeUrl: { type: String, default: '' },
    applicationStatus: {
      type: String,
      enum: ['applied', 'hr_passed', 'tech_submitted', 'tech_passed', 'selected', 'offer_sent'],
      default: 'applied',
    },
    currentRound: { type: Number, default: 1 },
    hrReviewReason: { type: String, default: '' },
    techReviewReason: { type: String, default: '' },
  },
  { timestamps: true },
)

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', userSchema)
module.exports = User
