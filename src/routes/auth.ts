import express from 'express'
import {
    login,
    register,
    logout,
    getMe
} from '../controllers/authController'
import { verifyToken } from '../middleware/verifyToken'
const router = express.Router()


router.post('/login', login)
router.post('/register', register)
router.post('/logout', logout)
router.get('/me', verifyToken, getMe)


export default router