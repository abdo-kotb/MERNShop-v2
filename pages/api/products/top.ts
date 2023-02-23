import Product from '@/models/product-model'
import connectDB from '@/config/db'
import nextConnect from 'next-connect'
import errorHandler from '@/utils/error-middleware'

// @desc Get top-rated products
// @route GET /api/products/top
// @access Public
export default nextConnect({ onError: errorHandler })
  .use(connectDB)
  .get(async (_req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3)
    return res.json(products)
  })
