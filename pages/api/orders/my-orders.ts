import connectDB from '@/config/db'
import { UserRequest } from '@/interfaces/user'
import Order from '@/models/order-model'
import { protectRoute } from '@/utils/auth-middleware'
import errorHandler from '@/utils/error-middleware'
import nextConnect from 'next-connect'

// @desc Get logged in user orders
// @route GET /api/orders/my-orders
// @access Private
export default nextConnect({
  onError: errorHandler,
})
  .use(connectDB)
  .use(protectRoute)
  .get(async (req: UserRequest, res) => {
    const orders = await Order.find({ user: req.user._id })

    return res.json(orders)
  })
