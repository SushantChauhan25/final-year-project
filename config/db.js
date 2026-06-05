const mongoose = require('mongoose')

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI is not set. Backend started without a database connection.')
    return
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

module.exports = connectDB
