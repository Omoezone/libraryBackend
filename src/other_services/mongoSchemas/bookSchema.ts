import mongoose from "mongoose";
import { Schema } from "mongoose";
// JEG ER I TVIVL OM VI SKAL BRUGE ID REFERENCER PÅ ANDET END BOOKS I USERS interactiontags
const bookSchema = new Schema({
    title: { type: String, required: true },
    picture: { type: String, required: true },
    summary: { type: String, required: true },
    pages: { type: Number, required: true },
    amount: { type: Number, required: true },
    available_amount: { type: Number, required: true },
    tags: [
        {
            title: { type: String, required: true },
            description: { type: String, required: true }
        }
    ],
    author: {
        username: { type: String, required: true },
        total_books: { type: Number, required: true }
    }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
