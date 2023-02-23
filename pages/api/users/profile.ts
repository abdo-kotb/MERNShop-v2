import connectDB from '@/config/db'
import { UserRequest } from '@/interfaces/user'
import User from '@/models/user-model'
import { protectRoute } from '@/utils/auth-middleware'
import errorHandler from '@/utils/error-middleware'
import generateToken from '@/utils/generate-token'
import nextConnect from 'next-connect'

// @route /api/users/profile
// @access Private
export default nextConnect({ onError: errorHandler })
  .use(connectDB)
  .use(protectRoute)

  // @desc Get user profile
  .get(async (req: UserRequest, res) => {
    const user = await User.findById(req.user._id)

    if (!user) {
      res.status(404)
      throw new Error('User not found')
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  })

  // @desc Update user profile
  .put(async (req: UserRequest, res) => {
    const user = await User.findById(req.user._id)

    if (!user) {
      res.status(404)
      throw new Error('User not found')
    }

    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) user.password = req.body.password

    const updatedUser = await user.save()

    return res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    })
  })
