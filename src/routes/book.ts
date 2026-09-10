import express from 'express'
import {
  createBook,
  getAllBooks,
  getBook,
  updateBook,
  deleteBook,
} from '../controllers/bookController'
import { verifyToken } from '../middleware/verifyToken'
const router = express.Router()

router.post('/', verifyToken, createBook)
router.get('/', getAllBooks)
router.get('/:id', getBook)
router.patch('/:id', verifyToken, updateBook)
router.delete('/:id', verifyToken, deleteBook)

export default router
