import express from 'express';
import { driver } from '../../db_services/neo4j/neo4jConnSetup'
import { v4 as uuid } from 'uuid';
import logger from '../../other_services/winstonLogger';
import { verifyRole } from './neo4jAuthRouter';
const router = express();
router.use(express.json());


//Get all reviews works
router.get('/neo4j/reviews', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).send("Authorization token is not provided");
            return;
        }else{
            if(!(await verifyRole(token, ["admin", "customer", "audit"]))){
                res.status(401).send("No access for your role");
                return;
            }
        }
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
                id: record.get("r").properties.review_id,
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

router.post('/neo4j/create/review', async (req, res) => {
    try{
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).send("Authorization token is not provided");
            return;
        }else{
            if(!(await verifyRole(token, ["admin", "customer"]))){
                res.status(401).send("No access for your role");
                return;
            }
        }
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

export default router;