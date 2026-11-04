const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  images: { type: [String], default: [] },
  address: { type: String, required: true },
  category: { type: String, default: "Community" },
  vibe: { type: String, default: "A place worth sharing" },
  bestTime: { type: String, default: "Anytime" },
  tip: { type: String, default: "" },
  budget: { type: Number, min: 0, default: 0 },
  days: { type: Number, min: 1, default: 1 },
  tags: { type: [String], default: [] },
  // location: {
  //   lat: { type: Number, required: true },
  //   lng: { type: Number, required: true }
  // },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Place", placeSchema);
