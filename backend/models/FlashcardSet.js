//const mongoose = require('mongoose');
import mongoose from "mongoose";

const flashcardSchema = new mongoose.Schema({
  front: { type: String, required: true },
  back: { type: String, required: true },
  isFavorite: { type: Boolean, default: false },
});

const flashcardSetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: String,
  cards: [flashcardSchema],
});

// module.exports = mongoose.model('FlashcardSet', flashcardSetSchema);
const FlashcardSet = mongoose.model('FlashcardSet', flashcardSetSchema);

export default FlashcardSet;