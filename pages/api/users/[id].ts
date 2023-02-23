import connectDB from '@/config/db'
import User from '@/models/user-model'
import { isAdmin, protectRoute } from '@/utils/auth-middleware'
import errorHandler from '@/utils/error-middleware'
import { Request } from 'express'
import nextConnect from 'next-connect'

// @route /api/users/:id
// @access Private/Admin
export default nextConnect({ onError: errorHandler })
  .use(connectDB)
  .use(protectRoute)
  .use(isAdmin)

  // @desc Get user by id
  .get(async (req: Request, res) => {
    const user = await User.findById(req.query.id).select('-password')

    if (user) res.json(user)

    res.status(404)
    throw new Error('User not found')
  })

  // @desc Update user
  .put(async (req: Request, res) => {
    const user = await User.findById(req.query.id)

    if (!user) {
      res.status(404)
      throw new Error('User not found')
    }

    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin ?? user.isAdmin

    const updatedUser = await user.save()

    return res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  })

  // @desc Delete user
  .delete(async (req: Request, res) => {
    const user = await User.findById(req.query.id)

    if (user) {
      await user.remove()
      return res.json({ message: 'User removed' })
    }

    res.status(404)
    throw new Error('User not found')
  })
