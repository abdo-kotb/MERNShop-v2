import { NextFunction, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import User from '@/models/user-model'

import { UserRequest } from '@/interfaces/user.js'

const protectRoute = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  let token: string

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  ) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }

  try {
    token = req.headers.authorization.split(' ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET!)

    req.user = await User.findById((decoded as JwtPayload).id).select(
      '-password'
    )
    next()
  } catch (error) {
    res.status(401)
    throw new Error('Not authorized, token failed')
  }
}

const isAdmin = (req: UserRequest, res: Response, next: NextFunction) => {
  if (req.user?.isAdmin) return next()

  res.status(401)
  throw new Error('Not authorized as an admin')
}

export { protectRoute, isAdmin }
