import mongoose, { Schema } from 'mongoose'

const bookSchema = new Schema(
  {
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

bookSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'book_id',
})

const Book = mongoose.model('Book', bookSchema)
export default Book
