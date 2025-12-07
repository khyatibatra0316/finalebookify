import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    coverImage: { type: String },
    category: { type: String },
    price: { type: Number },
    rating: { type: Number, default: 0 },
    writerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    fileUrl: { type: String },
    isbn: { type: String },
    publishedDate: { type: Date },
    pageCount: { type: Number },
    language: { type: String, default: 'English' },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    }
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
