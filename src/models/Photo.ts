import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
  name: String,
  url: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Photo = mongoose.models.Photo || mongoose.model("Photo", photoSchema);