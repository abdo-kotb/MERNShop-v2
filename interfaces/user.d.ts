import { Request } from 'express'

export default interface User {
  name: string
  email: string
  isAdmin: boolean
  _id: string
}

export interface UserRequest extends Request {
  user: User
}
