import { Request, Response } from 'express'
import Book from '../models/book'
import Review from '../models/reviews'

export const createBook = async (req: Request, res: Response) => {
  const { title, description, author, genres, image, published_year } = req.body
  if (title === undefined) {
    res.status(400).json({ message: 'title is required' })
    return
  }

  try {
    const result = await Book.create({
      title,
      description,
      author,
      genres,
      image,
      published_year,
    })
    res.status(201).json(result)
  } catch (e) {
    console.log('Error:', e)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const result = await Book.find()
    res.status(200).json(result)
  } catch (e) {
    console.log('Error:', e)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getBook = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const result = await Book.findById(id).populate('reviews')
    if (!result) {
      res.status(404).json({ message: 'Book not found' })
      return
    }
    res.status(200).json(result)
  } catch (e) {
    console.log('Error:', e)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const updateBook = async (req: Request, res: Response) => {
  const { id } = req.params
  const { title, description, author, genres, image, published_year } = req.body

  try {
    const result = await Book.updateOne(
      { _id: id },
      { title, description, author, genres, image, published_year },
    )
    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'Book not found' })
      return
    }
    res.status(200).json({ message: 'Book updated' })
  } catch (e) {
    console.log('Error:', e)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const deleteBook = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const result = await Book.findByIdAndDelete(id)
    if (!result) {
      res.status(404).json({ message: 'Book not found' })
      return
    }
    await Review.deleteMany({ book_id: id })
    res.status(200).json({ message: 'Book deleted' })
  } catch (e) {
    console.log('Error:', e)
    res.status(500).json({ message: 'Internal server error' })
  }
}
