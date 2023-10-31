import { ObjectId } from "mongodb";
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
            description: { type: String }
        }
    ],
    reviews: [
        {
            user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            stars: { type: Number, required: true },
        }
    ],
    author: { type: Schema.Types.ObjectId, ref: 'Author' }
});

const Book = mongoose.model('Book', bookSchema);

export default Book;


// remove desc for tags
// author is a reference 