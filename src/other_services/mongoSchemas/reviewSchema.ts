import mongoose from "mongoose";
import { Schema } from "mongoose";

const reviewSchema = new Schema({
    stars : { type: Number},
    user_id : { type: Number},
    book_id : { type: Number},
});


const Review = mongoose.model('Review', reviewSchema);
export default Review;
