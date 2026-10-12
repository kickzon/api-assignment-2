import mongoose, { Schema } from 'mongoose'

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },

    author: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    genres: {
      type: [String],
      required: true,
      validate: {
        validator: (genres: string[]) => genres.length > 0,
        message: 'At least one genre is required',
      },
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    published_year: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: 'Published year must be an integer',
      },
    },

    created_at: {
      type: Date,
      default: Date.now,
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
