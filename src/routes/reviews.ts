import express from 'express'
import { getAllReviews, getReviewById, createReview, updateReview, deleteReview } from '../controllers/reviewController'
import { verifyToken } from '../middleware/verifyToken'


const router = express.Router()

router.get('/', getAllReviews)
router.get('/:id', getReviewById)
router.post('/', createReview)
router.patch('/:id', verifyToken, updateReview)
router.delete('/:id', verifyToken, deleteReview)

export default router