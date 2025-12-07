import express from "express";
import Book from "../models/Book.js";
import userAuth from "../middleware/userAuth.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// GET ALL BOOKS
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().populate('writerId', 'name email');
    res.json({ success: true, books });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET BOOKS BY WRITER ID
router.get("/writer/:writerId", userAuth, async (req, res) => {
  try {
    const books = await Book.find({ writerId: req.params.writerId });
    res.json({ success: true, books });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET SINGLE BOOK BY ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('writerId', 'name email');
    if (!book)
      return res.status(404).json({ success: false, message: "Book not found" });

    res.json({ success: true, book });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ADD A NEW BOOK WITH FILE UPLOAD
router.post("/", userAuth, upload.fields([
  { name: 'bookFile', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const bookData = {
      ...req.body,
      writerId: req.userId // From userAuth middleware
    };

    // Add file URLs if files were uploaded
    if (req.files) {
      if (req.files.bookFile) {
        bookData.fileUrl = `/uploads/${req.files.bookFile[0].filename}`;
      }
      if (req.files.coverImage) {
        bookData.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
      }
    }

    const newBook = new Book(bookData);
    await newBook.save();
    res.json({ success: true, book: newBook });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});


// UPDATE BOOK
router.put("/:id", userAuth, upload.fields([
  { name: 'bookFile', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Add file URLs if new files were uploaded
    if (req.files) {
      if (req.files.bookFile) {
        updateData.fileUrl = `/uploads/${req.files.bookFile[0].filename}`;
      }
      if (req.files.coverImage) {
        updateData.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedBook) return res.status(404).json({ success: false, message: "Book not found" });
    res.json({ success: true, book: updatedBook });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE BOOK
router.delete("/:id", userAuth, async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ success: false, message: "Book not found" });
    res.json({ success: true, message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
