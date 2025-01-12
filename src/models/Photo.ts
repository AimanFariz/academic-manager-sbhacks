import mongoose from "mongoose";

const PhotoSchema = new mongoose.Schema({
  name: String,
  url: String,
  extractedText: String,
  topics: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const Photo = mongoose.models.Photo || mongoose.model('Photo', PhotoSchema);