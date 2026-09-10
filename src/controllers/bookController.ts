import { Request, Response } from 'express'
import Book from '../models/book'

export const createBook = async (req: Request, res: Response) => {
  const result = await Book.create(req.body)
  res.json(result)
}

export const getAllBooks = async (req: Request, res: Response) => {
  const result = await Book.find()
  res.json(result)
}

export const getBook = async (req: Request, res: Response) => {
  const result = await Book.findOne({ _id: req.params.id })
  res.json(result)
}

export const updateBook = async (req: Request, res: Response) => {
  const result = await Book.updateOne({ _id: req.params.id }, req.body)
  res.json(result)
}

export const deleteBook = async (req: Request, res: Response) => {
  const result = await Book.deleteOne({ _id: req.params.id })
  res.json(result)
}
