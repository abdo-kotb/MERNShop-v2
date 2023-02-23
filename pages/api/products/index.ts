import asyncHandler from 'express-async-handler'
import Product from '@/models/product-model'
import connectDB from '@/config/db'
import { Request } from 'express'
import User, { UserRequest } from '@/interfaces/user'
import nextConnect from 'next-connect'
import errorHandler from '@/utils/error-middleware'
import { isAdmin, protectRoute } from '@/utils/auth-middleware'

// @route /api/products
export default nextConnect({ onError: errorHandler })
  .use(connectDB)

  // @desc Fetch product
  // @access Public
  .get(async (req: Request, res) => {
    const pageSize = 10
    const page = req.query.page ? +req.query.page : 1

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {}

    const count = await Product.count({ ...keyword })

    const products = await Product.find({ ...keyword })
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1))

    return res.json({ products, page, pages: Math.ceil(count / pageSize) })
  })
  .use(protectRoute)
  .use(isAdmin)

  // @desc Create product
  // @access Private/Admin
  .post(async (req: UserRequest, res) => {
    const product = new Product({
      name: 'Sample name',
      price: 0,
      user: req.user._id,
      image: '/images/sample.jpg',
      brand: 'Sample brand',
      category: 'Sample category',
      countInStock: 0,
      numReviews: 0,
      description: 'Sample description',
    })

    const createdProduct = await product.save()

    return res.status(201).json(createdProduct)
  })
