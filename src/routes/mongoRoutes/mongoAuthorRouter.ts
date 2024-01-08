import express from 'express';
import logger from '../../other_services/winstonLogger';
import Author from '../../other_services/mongoSchemas/authorSchema';
import { checkUserRole } from './mongoAuthRouter';

const router = express.Router();
router.use(express.json());

//get all authors
router.get("/mongo/authors", /*checkUserRole("admin"), */ async (req, res) => {
    try {
        console.log("Getting all authors")
        const result = await getAllAuthorsMongo();
        res.status(200).send(result);
    } catch (error) {
        logger.error("Error in getting all authors: [Mongo getAllAuthors, 1]",error);
        res.status(500).send(error);
    }
});


async function getAllAuthorsMongo() {
    try {
        const authors = await Author.find({});
        return authors;
    } catch (error) {
        logger.error("Error in getting all authors: [Mongo getAllAuthors, 2]",error);
        throw error;
    }
}





//create author
//This deos not work why ? 
router.post("/mongo/create/author", async (req, res) => {
    try {
        console.log("Creating author");
        const { username, total_books } = req.body;
        
        if (!username || total_books === undefined) {
            // Log and send an error response if required fields are missing
            const errorMessage = "Missing required fields: username and totalBooks";
            logger.error(`Error in creating author: [Mongo createAuthor, 3] ${errorMessage}`);
            return res.status(400).send({ error: errorMessage });
        }

        const result = await createAuthorMongo(username, total_books);
        console.log("Author created!:", result);
        res.status(200).send(result);
    } catch (error) {
        logger.error("Error in creating author: [Mongo createAuthor, 2]", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});


async function createAuthorMongo(username: string, total_books: number) {
    try {
        const author = new Author({
            username: username,
            total_books: total_books  // Ensure that the field name matches the schema
        });
        await author.validate();  // Validate the model before saving
        await author.save();
        return author;
    } catch (error) {
        logger.error("Error in creating author: [Mongo createAuthor, 1]", error);
        throw error;
    }
}


//delete author
router.delete("/mongo/author/delete/:id", async (req, res) => {
    try{
        const result = await deleteAuthorMongo(req.params.id);
        if(!result)
            return res.status(400).send("Author does not exist");
        console.log("author deleted! : " + result);
        res.status(200).send(result);
    }catch(error){
        logger.error("Error in deleting author: [Mongo deleteAuthor, 2]",error);
        throw error;
    }
});


async function deleteAuthorMongo(id: string) {
    try{
        const author = await Author.findByIdAndDelete(id);
        return author;
    }catch(error){
        logger.error("Error in deleting author: [Mongo deleteAuthor, 1]",error);
        throw error;
    }
}


export default router;