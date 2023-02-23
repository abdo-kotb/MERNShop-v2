import Order from '@/models/order-model'
import { protectRoute } from '@/utils/auth-middleware'
import { Request } from 'express'
import connectDB from '@/config/db'
import nextConnect from 'next-connect'
import errorHandler from '@/utils/error-middleware'

// @desc Update order to paid
// @route PUT /api/orders/:id/pay
// @access Private
export default nextConnect({ onError: errorHandler })
  .use(connectDB)
  .use(protectRoute)
  .put(async (req: Request, res) => {
    const order = await Order.findById(req.query.id)

    if (order) {
      order.isPaid = true
      order.paidAt = new Date(Date.now())
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      }

      const updatedOrder = await order.save()

      return res.json(updatedOrder)
    }

    res.status(404)
    throw new Error('Order not found')
  })
