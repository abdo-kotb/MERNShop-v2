import Order from '@/models/order-model'
import { Request } from 'express'
import { isAdmin, protectRoute } from '@/utils/auth-middleware'
import connectDB from '@/config/db'
import nextConnect from 'next-connect'
import errorHandler from '@/utils/error-middleware'

// @desc Update order to delivered
// @route GET /api/orders/:id/deliver
// @access Private/Admin
export default nextConnect({ onError: errorHandler })
  .use(connectDB)
  .use(protectRoute)
  .use(isAdmin)
  .get(async (req: Request, res) => {
    const order = await Order.findById(req.query.id)

    if (order) {
      order.isDelivered = true
      order.deliveredAt = new Date(Date.now())

      const updatedOrder = await order.save()

      return res.json(updatedOrder)
    }

    res.status(404)
    throw new Error('Order not found')
  })
