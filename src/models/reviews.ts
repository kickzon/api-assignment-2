import mongoose, { Schema } from 'mongoose'

const reviewSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 1000,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be an integer',
    },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  book_id: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
})

const Review = mongoose.model('Review', reviewSchema)

export default Review
