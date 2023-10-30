import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
    created_at: { type: Date, default: Date.now },
    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: Date, default: null },
    user_data: {
        email: { type: String, required: true },
        password: { type: String, required: true },
        user_name: {
            first_name: { type: String, required: true },
            last_name: { type: String, required: true }
        }
    },
    bookInteractions: [
        {
            bookId: { type: mongoose.Types.ObjectId, default: null },
            intereactionType: { type: String, enum: ['Borrowed', 'Read', 'Bookmarked'] }
        }
    ],
    favoritedAuthors: [
        {
            username: { type: String },
            total_books: { type: Number }
        }
    ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;