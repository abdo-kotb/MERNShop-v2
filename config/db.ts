import { NextFunction } from 'express'
import mongoose from 'mongoose'

export const connectDB = async (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (mongoose.connection.readyState === 1) return next()

  try {
    mongoose.set('strictQuery', false)
    const conn = await mongoose.connect(process.env.MONGO_URI!)

    console.log(`MongoDB Connected:  ${conn.connection.host}`)

    next()
  } catch (err: any) {
    console.error(`Error: ${err.message}`)
    next(err.message)
  }
}

export default connectDB
