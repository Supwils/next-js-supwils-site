import mongoose from 'mongoose';

// Define the schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Check if the model exists before creating a new one
const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;


// const mongoose = require('mongoose');

// const BlockSchema = new mongoose.Schema({
//     type: { type: String, enum: ['text', 'code', 'image'], required: true },
//     content: { type: String, required: true },   // Stores the content (text or code)
//     language: { type: String },                  // For code blocks
//     styles: {
//       color: { type: String },                  // Text color (e.g., 'blue', '#ff0000')
//       fontSize: { type: String },               // Font size (e.g., '16px')
//       fontWeight: { type: String },             // Font weight (e.g., 'bold')
//       // You can add more style properties as needed
//     }
//   });

// const BlogPostSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   blocks: [BlockSchema],   // Array of content blocks (text, code, image)
//   tags: [{ type: String }],
//   categories: [{ type: String }],
//   created_at: { type: Date, default: Date.now },
//   updated_at: { type: Date },
// });

// const BlogPost = mongoose.model('BlogPost', BlogPostSchema);