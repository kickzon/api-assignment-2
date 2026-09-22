import express from 'express'
import {
  createBook,
  getAllBooks,
  getBook,
  updateBook,
  deleteBook,
} from '../controllers/bookController'
import { verifyToken } from '../middleware/verifyToken'
import { requireAdmin } from '../middleware/requireAdmin'
const router = express.Router()

router.post('/', verifyToken, requireAdmin, createBook)
router.get('/', getAllBooks)
router.get('/:id', getBook)
router.patch('/:id', verifyToken, requireAdmin, updateBook)
router.delete('/:id', verifyToken, requireAdmin, deleteBook)

export default router
