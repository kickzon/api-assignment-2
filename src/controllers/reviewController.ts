import { Request, Response } from "express"
import Review from "../models/reviews"

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
  try {
    const newReview = await Review.create(req.body)
    res.status(201).json(newReview)
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" })
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
