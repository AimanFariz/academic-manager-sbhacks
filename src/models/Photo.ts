import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    extractedText: {
      type: String,
      trim: true
    },
    topics: {
      type: String,
      trim: true
    },
    deadline: {
      type: Date,
      required: false
    }
  }, {
    timestamps: true
  });

export const Photo = mongoose.models.Photo || mongoose.model("Photo", photoSchema);