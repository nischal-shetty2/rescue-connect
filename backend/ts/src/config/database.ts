import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!)
    console.log(`MongoDB Connected ${conn.connection.host}`)
  } catch (error) {
    console.error('Database Connection Failed:', error)
    console.log(
      '⚠️  Server will continue without database. Some features may use dummy data.'
    )
  }
}
export default connectDB
