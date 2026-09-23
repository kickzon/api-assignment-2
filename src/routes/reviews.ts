import express from 'express'
import { getAllReviews, getReviewById, createReview, updateReview, deleteReview } from '../controllers/reviewController'
import { verifyToken } from '../middleware/verifyToken'
import { requireAdmin } from '../middleware/requireAdmin'


const router = express.Router()

router.get('/', getAllReviews)
router.get('/:id', getReviewById)
router.post('/', createReview)
router.patch('/:id', verifyToken, requireAdmin, updateReview)
router.delete('/:id', verifyToken, requireAdmin, deleteReview)

export default router
