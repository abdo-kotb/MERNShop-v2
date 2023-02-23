import connectDB from '@/config/db'
import Order from '@/models/order-model'
import { protectRoute } from '@/utils/auth-middleware'
import errorHandler from '@/utils/error-middleware'
import { Request } from 'express'
import nextConnect from 'next-connect'

// @desc Get order by ID
// @route GET /api/orders/:id
// @access Private
export default nextConnect({ onError: errorHandler })
  .use(connectDB)
  .use(protectRoute)
  .get(async (req: Request, res) => {
    const order = await Order.findById(req.query.id).populate(
      'user',
      'name email'
    )

    if (order) return res.json(order)

    res.status(404)
    throw new Error('Order not found')
  })
