import express from 'express'
import {
  createBook,
  getAllBooks,
  getBook,
  updateBook,
  deleteBook,
} from '../controllers/bookController'
const router = express.Router()

router.post('/', createBook)
router.get('/', getAllBooks)
router.get('/:id', getBook)
router.patch('/:id', updateBook)
router.delete('/:id', deleteBook)

export default router
