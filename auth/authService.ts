import IUser, { removePassword } from '../Users/IUser'
import jwt from 'jsonwebtoken'

export const generateToken = (user: IUser) => {
  // create a jwt token that is valid for 7 days
  const token = jwt.sign({ sub: user }, process.env.JWT_SECRET ?? '', {
    expiresIn: '7d'
  })

  return {
    ...user,
    token
  }
}