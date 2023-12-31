import express from "express";
import { Request } from "express";
import logger from "../other_services/winstonLogger";
import { Book as Books, Author, Review, Tag } from "../other_services/models/seqModels";
import { QueryTypes } from "sequelize";
import sequelize from "../other_services/sequalizerConnection";

const router = express.Router();
router.use(express.json());


// ---------------------- Get all books ----------------------
router.get("/books", async (req, res) => {
    try {
        const result = await getAllBooks();
        res.status(200).send(result);
    } catch (error) {
        logger.error("Error getting all books: [getAllbooks, 1]", error);
        res.status(500).send(error);
    }
});

export async function getAllBooks() {
    try {
        const books = await Books.findAll({
            include: [
                {
                    model: Review,
                    attributes: ["stars", "user_id"],
                },
                {
                    model: Author,
                    attributes: ["author_id", "username", "total_books"],
                },
                {
                    model: Tag,
                    attributes: ["title", "tag_description"],
                    through: {
                        attributes: [], 
                    }
                },
            ],
        });
        const bookArray = books.map((book) => book.toJSON());
        return bookArray;
    } catch (error) {
        logger.error("Error getting all books: [getAllbooks, 2]", error);
        throw error;
    }
}

// --------------------  Get book with author username --------------------
router.get("/book/:id", async (req: Request<{ id: number}>, res) => {
    try {
        const result = await getBookById(req.params.id);
        res.status(200).send(result);
    } catch (error) {
        logger.error("Error getting book with author: [getBookById, 1] ", error);
        res.status(500).send(error);
    }
});

export async function getBookById(id: number) {
    try{
        const results = await sequelize.query(`CALL get_book_with_author(?)`, {
            replacements: [id],
            type: QueryTypes.RAW,
            model: Books,
        });
        if(!results) {
            logger.error("No book found with the given id: [getBookById, 2]")
            throw new Error;
        }
        return results;
    }catch(error){
        logger.error('Error calling stored procedure: [getBookById, 3] ', error);
        throw error;
    }
}


// --------------------- Get range of books ---------------------
router.get("/books/:range", async (req, res) => {
    
    try {
           const finishRange = Number(req.params.range);
            const result = await getBooksUpToFinishRange(finishRange);
            res.status(200).send(result);
        }
    catch (error) {
        logger.error("Error getting books up to finish range: [getBooksUpToFinishRange]", error);
        res.status(500).send(error);
    }

});

export async function getBooksUpToFinishRange(finishRange: number) {
    try {
        const books = await Books.findAll({
            limit: finishRange,
        });

        const bookArray = books.map((book) => book.toJSON());
        return bookArray;
    } catch (error) {
        logger.error("Error getting books up to finish range: [getBooksUpToFinishRange]", error);
        throw error;
    }
}



// --------------------- Create book ---------------------
router.post("/book",  async (req, res) => {
    try{
        const result = await createBook(req.body);
        res.status(200).json(result);
    } catch (error) {
        logger.error("Error in creating a new book: [createBook, 1]", error);
        res.status(500).json(error);
    }
});

export async function createBook(values: Books) {
    try{
        const book = await Books.create({
            id: values.book_id,
            title: values.title,
            picture: values.picture,
            summary: values.summary,
            pages: values.pages,
            amount: values.amount,
            available_amount: values.available_amount,
            author_id: values.author_id,
        },
        );
        logger.info("created book: ", book.toJSON());
        return book.toJSON();
    }catch(error){
        logger.error("Error in creating a new book: [createBook, 2]", error);
        throw error;
    }
}
export default router;