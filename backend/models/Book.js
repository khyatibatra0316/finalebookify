import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    coverImage: { type: String },
    category: { type: String },
    price: { type: Number },
    rating: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
