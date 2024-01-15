import express from 'express';
import logger from '../../other_services/winstonLogger';
import review from '../../other_services/mongoSchemas/reviewSchema';

const router = express.Router();
router.use(express.json());

//get all reviews
router.get("/mongo/reviews", async (req, res) => {
    console.log("Getting all reviews")
    try{
        const result = await getAllReviewMongo();
        res.status(200).send(result);
    }catch(error){
        logger.error("Error in getting all reviews: [Mongo getAllReviews, 1]",error);
        res.status(500).send(error);
    }
});


async function getAllReviewMongo(){
    try{
        const reviews = await review.find({}); 
        return reviews;
    }catch(error){
        logger.error("Error in getting all reviews: [Mongo getAllReviews, 2]",error);
        throw error;
    }
};


//create review


router.post("/mongo/review/create", async (req, res) => {
    console.log("Creating review")
    try{
        
        const result = await createReviewMongo(req.body.stars, req.body.user_id, req.body.book_id);
        res.status(200).send(result);
    }catch(error){
            logger.error("Error in creating review: [Mongo createReview, 2]",error);
            throw error;
        }
});


async function createReviewMongo(stars: number, user_id: number, book_id: number){
   
     try{
    
        const newReview = new review({
            review_data: {
                stars: stars,
                user_id: user_id,
                book_id: book_id,
            },
        });
        
        const result = await newReview.save();
        return result;


    }catch(error){
        logger.error("Error in creating review: [Mongo createReview, 1]",error);
        throw error;
    }
}

router.post("/mongo/review/update", async (req, res) => {
    console.log("Updating review")
    try{
        const result = await updateReview(req.body.id, req.body.stars, req.body.user_id, req.body.book_id);
        res.status(200).send(result);
    }catch(error){
        logger.error("Error in updating review: [Mongo updateReview, 2]",error);
        throw error;
    }
});


async function updateReview(id:string, stars: number, user_id: number, book_id: number) {
    try{
        const newReview = await review.findByIdAndUpdate(id, {
            review_data: {
                stars: stars,
                user_id: user_id,
                book_id: book_id,
            },
        });

        return newReview;

    }catch(error){
        logger.error("Error in updating review: [Mongo updateReview, 1]",error);
        throw error;
    }
}


export default router;