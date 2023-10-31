import mongoose from "mongoose";
import { Schema } from "mongoose";

const authorSchema = new Schema({
    username: { type: String, required: true },
    total_books: { type: Number, required: true }
});

const Author = mongoose.model('Author', authorSchema);

export default Author;
