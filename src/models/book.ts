import mongoose, { Schema } from 'mongoose'

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  author: String,
  genres: [String],
  image: String,
  published_year: Number,
})

const Book = mongoose.model('Book', bookSchema)
export default Book
