import { Response } from 'express'

const errorHandler = (err: any, _req: Request, res: Response) => {
  const error = res.statusCode === 200 ? 500 : res.statusCode
  res.status(error)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
}

export default errorHandler
