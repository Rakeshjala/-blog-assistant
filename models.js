const mongoose = require("mongoose");
const { Schema } = mongoose;

const User = mongoose.model("User", new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
}, { timestamps: true }));

const Post = mongoose.model("Post", new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["titles", "content", "summary", "chat"], required: true },
  prompt: String,
  result: { type: String, required: true },
}, { timestamps: true }));

module.exports = { User, Post };
