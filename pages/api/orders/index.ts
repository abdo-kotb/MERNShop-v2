import Order from '@/models/order-model'
import { isAdmin, protectRoute } from '@/utils/auth-middleware'
import { UserRequest } from '@/interfaces/user'
import connectDB from '@/config/db'
import nextConnect from 'next-connect'
import errorHandler from '@/utils/error-middleware'

// @route /api/orders
export default nextConnect({ onError: errorHandler })
  .use(connectDB)
  .use(protectRoute)
  .post(async (req: UserRequest, res) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body

    if (!orderItems?.length) {
      res.status(400)
      throw new Error('No order items')
    }

    const order = new Order({
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      user: req.user._id,
    })

    const createdOrder = await order.save()

    return res.status(201).json(createdOrder)
  })
  .use(isAdmin)
  .get(async (_req, res) => {
    const orders = await Order.find({}).populate('user', 'id name')
    return res.json(orders)
  })
