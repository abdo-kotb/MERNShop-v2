import connectDB from '@/config/db'
import User from '@/models/user-model'
import { isAdmin, protectRoute } from '@/utils/auth-middleware'
import errorHandler from '@/utils/error-middleware'
import generateToken from '@/utils/generate-token'
import { Request } from 'express'
import nextConnect from 'next-connect'

// @route /api/users
export default nextConnect({ onError: errorHandler })
  .use(connectDB)
  // @desc Register user
  // @access Public
  .post(async (req: Request, res) => {
    const { name, email, password } = req.body

    const userExist = await User.findOne({ email })

    if (userExist) {
      res.status(400)
      throw new Error('User already exists')
    }

    const user = await User.create({
      name,
      email,
      password,
    })

    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      })
    } else {
      res.status(400)
      throw new Error('Invalid user data')
    }
  })
  .use(protectRoute)
  .use(isAdmin)

  // @desc Get all users
  // @access Private/Admin
  .get(async (_req, res) => {
    const users = await User.find({})
    return res.json(users)
  })
