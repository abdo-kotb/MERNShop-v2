import Product from '@/models/product-model'
import { isAdmin, protectRoute } from '@/utils/auth-middleware'
import { Request } from 'express'
import IProduct from '@/interfaces/Product'
import connectDB from '@/config/db'
import nextConnect from 'next-connect'
import errorHandler from '@/utils/error-middleware'

// @route /api/products/:id
export default nextConnect({ onError: errorHandler })
  .use(connectDB)

  // @desc Fetch product
  // @access Public
  .get(async (req: Request, res) => {
    const product = await Product.findById(req.query.id)
    if (product) return res.json({ product })
    res.status(404)
    throw new Error('Product not found')
  })
  .use(protectRoute)
  .use(isAdmin)

  // @desc Update product
  // @access Private/Admin
  .put(async (req: Request, res) => {
    const product = await Product.findById(req.query.id)

    if (!product) {
      res.status(404)
      throw new Error('Product not found')
      return
    }

    const { name, price, description, image, brand, category, countInStock } =
      req.body as IProduct

    product.name = name
    product.price = price
    product.description = description
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock

    const updatedProduct = await product.save()

    return res.json(updatedProduct)
  })

  // @desc Delete product
  // @access Private/Admin
  .delete(async (req: Request, res) => {
    const product = await Product.findById(req.query.id)

    if (!product) {
      res.status(404)
      throw new Error('Product not found')
    }

    await product.remove()
    res.json({ message: 'Product removed' })
  })
