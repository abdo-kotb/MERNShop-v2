import connectDB from '@/config/db'
import User from '@/models/user-model'
import errorHandler from '@/utils/error-middleware'
import generateToken from '@/utils/generate-token'
import { Request } from 'express'
import nextConnect from 'next-connect'

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
export default nextConnect({ onError: errorHandler })
  .use(connectDB)
  .post(async (req: Request, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      })
    }

    res.status(401)
    throw new Error('Invalid email or password')
  })
