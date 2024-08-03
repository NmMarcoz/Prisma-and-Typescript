import {Router} from 'express'
import { login, signUp } from '../controllers/auth'

const authRoutes = Router()

authRoutes.post('/login', login)
authRoutes.post('/signup', signUp)

export default authRoutes
