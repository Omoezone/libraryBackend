import express from 'express';
import { driver } from '../../db_services/neo4j/neo4jConnSetup'
import { v4 as uuid } from 'uuid';
import logger from '../../other_services/winstonLogger';
const router = express();
router.use(express.json());


//Get all reviews works
router.get('/neo4j/reviews', async (req, res) => {
    try {
        const result: any = await readAllReviews();
        res.status(200).send(result);
    } catch (err) {
        logger.error(err);
        res.status(401).send('Something went wrong with getting all reviews');
    }
});

async function readAllReviews(){
    const session = driver.session();
    try{
        const result = await session.run(
            `MATCH (r:Review) RETURN r`
        );

        const allReviews = result.records.map((record:any) => {
            return {
                stars: record.get("r").properties.stars,
            };
            }); 
            console.log("Success getting all reviews: ", allReviews);
            return allReviews;
    }catch(error){
        logger.error(error);
        console.log("Something went wrong with readAllReviews");
    }finally{
        await session.close();
    }
}


//Create review virker!
router.post('/neo4j/create/review', async (req, res) => {
    try{
        const result: any = await createReview(req.body);
        res.status(200).send(result);
    }catch(error){
        logger.error(error);
        res.status(401).send('Something went wrong with creating a review');
    }
});

async function createReview(value: any) {
    const session = driver.session();

    try {
        const trans = await session.beginTransaction();

        // Create review object
        const createReview = await trans.run(
            `CREATE (r:Review {
                review_id: $reviewId,
                stars: $stars
            }) RETURN r`,
            {
                reviewId: uuid(),
                stars: value.stars
            }
        );

        const review = createReview.records[0].get("r").properties;
        //console.log("Successfully created review: ", review);

        // Create review data
        const reviewData = await trans.run(
            `CREATE (rd:ReviewData {
                review_id: $reviewId,
                stars: $stars
            }) RETURN rd`,
            {
                reviewId: uuid(),
                stars: review.stars
            }
        );
        const createdReviewData = reviewData.records[0].get("rd").properties;
        //console.log("Successfully created review data: ", createdReviewData);

        // Create relationship between review and review data
        await trans.commit()
        console.log("Successfully created review: ", createdReviewData);
        return {
            review: review,
            reviewData: createdReviewData
        };
    } catch (error) {
        logger.error(error);
        console.log("Something went wrong with createReview: ", error);
        throw error; // Propagate the error to the calling function
    } finally {
        await session.close();
    }
}

router.put("/neo4j/update/review", async (req, res) => {
    try{
        const result: any = await updateReview(req.body);
        res.status(200).send(result);
    }catch(error){
        logger.error(error);
        res.status(401).send('Something went wrong with updating a review');
    }
});


//update review virker!
async function updateReview(value: any) {
    const session = driver.session();

    try{
        const trans = await session.beginTransaction();

        const checkReview = await trans.run(
            `MATCH (r:Review) WHERE r.review_id = $reviewId RETURN r`,
            {
                reviewId: value.reviewId
            }
        );
        

        if(checkReview.records.length === 0){
            throw new Error("Review does not exist");
        }

        const result = await trans.run(
            `MATCH (r:Review) WHERE r.review_id = $reviewId SET r.stars = $stars RETURN r`,
            {
                reviewId: value.reviewId,
                stars: value.stars
            }
        );  
        
        const updatedReview = result.records[0].get("r").properties;
        console.log("Successfully updated review: ", updatedReview.properties);

        return updatedReview;

    }catch(error){
        logger.error(error);
        console.log("Something went wrong with updateReview");
    }finally{
       await session.close();
    }

};



export default router;