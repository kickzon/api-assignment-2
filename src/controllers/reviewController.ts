import { Request, Response } from "express"
import Review from "../models/reviews"
import mongoose from "mongoose"
import Book from "../models/book"

export const getAllReviews = async (req: Request, res: Response) => {
    try {
        const reviews = await Review.find()
        res.json(reviews)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

export const getReviewById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const review = await Review.findById(id)
    res.json(review)
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

export const createReview = async (req: Request, res: Response) => {
  const { name, content, rating, book_id } = req.body ?? {}

  if (
    typeof name !== "string" ||
    typeof content !== "string" ||
    typeof rating !== "number" ||
    typeof book_id !== "string"
  ) {
    res.status(400).json({
      message: "name, content, rating and book_id are required",
    })
    return
  }

  const normalizedName = name.trim()
  const normalizedContent = content.trim()

  if (normalizedName.length < 2 || normalizedName.length > 50) {
    res.status(400).json({
      message: "name must contain between 2 and 50 characters",
    })
    return
  }

  if (normalizedContent.length < 10 || normalizedContent.length > 1000) {
    res.status(400).json({
      message: "content must contain between 10 and 1000 characters",
    })
    return
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    res.status(400).json({
      message: "rating must be an integer between 1 and 5",
    })
    return
  }

  if (!mongoose.isValidObjectId(book_id)) {
    res.status(400).json({
      message: "book_id must be a valid id",
    })
    return
  }

  try {
    const bookExists = await Book.exists({ _id: book_id })

    if (!bookExists) {
      res.status(404).json({
        message: "book not found",
      })
      return
    }

    const newReview = await Review.create({
      name: normalizedName,
      content: normalizedContent,
      rating,
      book_id,
    })

    res.status(201).json(newReview)
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    })
  }
}

export const updateReview = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const updatedReview = await Review.findByIdAndUpdate(id, req.body, { new: true })
    res.json(updatedReview)
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const deletedReview = await Review.findByIdAndDelete(id)
    res.json({ message: "Review deleted" })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" })
  }
}
