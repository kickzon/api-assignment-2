import mongoose, { Schema } from 'mongoose'

const reviewSchema = new Schema({
  name: {
    type: String,
  },
  content: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  book_id: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
  },
})

const Review = mongoose.model('Review', reviewSchema)
export default Review