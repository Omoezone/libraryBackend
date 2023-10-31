import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
    created_at: { type: Date, default: Date.now, required:true},
    is_deleted: { type: Boolean, default: false, required:true},
    deleted_at: { type: Date, default: null },
    user_data: [{
        email: { type: String, required: true },
        password: { type: String, required: true },
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        timestamp: { type: Date, default: Date.now, required: true },
    }],
    bookInteractions: [
        {
            bookId: { type: Schema.Types.ObjectId, ref: 'Book'},
            intereactionType: { type: String, enum: ['Borrowed', 'Read', 'Bookmarked'] }
        }
    ],
    favoritedAuthors: [
        {
            author: { type: Schema.Types.ObjectId, ref: 'Author' }
        }
    ]
});

const User = mongoose.model('User', userSchema);

export default User;