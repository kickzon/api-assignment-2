import mongoose, { Schema } from 'mongoose'

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  author: {
    type: String,
    default: '',
  },
  genres: {
    type: [String],
    default: [],
  },
  image: {
    type: String,
    default: '',
  },
  published_year: {
    type: Number,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

const Book = mongoose.model('Book', bookSchema)
export default Book
