import {Router} from 'express'
import { login, me, signUp } from '../controllers/auth'
import authMiddleware from '../middlewares/auth'

const authRoutes = Router()

authRoutes.post('/login', login)
authRoutes.post('/signup', signUp)
authRoutes.get('/me', authMiddleware, me)

export default authRoutes
