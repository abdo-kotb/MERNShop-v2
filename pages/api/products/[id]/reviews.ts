import connectDB from '@/config/db'
import Review from '@/interfaces/Review'
import { UserRequest } from '@/interfaces/user'
import Product from '@/models/product-model'
import { protectRoute } from '@/utils/auth-middleware'
import errorHandler from '@/utils/error-middleware'
import nextConnect from 'next-connect'

// @desc Create new review
// @route POST /api/products/:id/reviews
// @access Private
export default nextConnect({ onError: errorHandler })
  .use(connectDB)
  .use(protectRoute)
  .post(async (req: UserRequest, res) => {
    const { rating, comment } = req.body

    const product = await Product.findById(req.query.id)

    if (product) {
      const alreadyReviewd = product.reviews.find(
        (review: Review) => review.user.toString() === req.user._id.toString()
      )

      if (alreadyReviewd) {
        res.status(400)
        throw new Error('Product already reviewd')
        return
      }

      const review = {
        name: req.user.name,
        rating: +rating,
        comment,
        user: req.user._id,
      }

      product.reviews.push(review)

      product.numReviews = product.reviews.length

      product.rating =
        product.reviews.reduce(
          (acc: number, item: Review) => item.rating + acc,
          0
        ) / product.reviews.length

      await product.save()

      return res.status(201).json({ message: 'Review added' })
    }
  })
