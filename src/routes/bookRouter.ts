import express from "express";
import { Request } from "express";
import conn from "../db_services/mysqlConnSetup";
import logger from "../other_services/winstonLogger";
import { Book } from "../other_services/models/seqBooks";
import { QueryTypes } from "sequelize";
import sequelize from "../other_services/sequalizerConnection";

const router = express.Router();
router.use(express.json());


// ---------------------- Get all books ----------------------
router.get("/books", async (req, res) => {
    try {
        const result: any = await getAllBooks();
        console.log("result", result)
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong with fetching books");
    }
});

export async function getAllBooks() {
    try {
        const books = await Book.findAll();
        console.log(books.every((book) => book instanceof Book));
        const bookArray = books.map((book) => book.toJSON());
        return bookArray;
    } catch (error) {
        throw error;
    }
}

// --------------------  Get book with author username --------------------
router.get("/book/:id", async (req: Request<{ id: number}>, res) => {
    try {
        const result: any = await getBookById(req.params.id);
        if (result.length == 0) {
            res.status(404).send("No book found with the given id");
        } else {
            res.status(200).send(result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong with fetching book");
    }
});

export async function getBookById(id: number) {
    try{
        const [results, metadata] = await sequelize.query(`CALL get_book_with_author(?)`, {
            replacements: [id],
            type: QueryTypes.RAW,
            model: Book,
        });
        logger.info("Got book and auther, with specifik book_id: ", results);
        return results;
    }catch(error){
        logger.error('Error calling stored procedure:', error);
        throw error;
    }
}

// --------------------- Create book ---------------------
router.post("/book",  async (req, res) => {
    try{
        const result = await createBook(req.body);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal server error");
    }
});

export async function createBook(values: Book) {
    try{
        const book = await Book.create({
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
        logger.error("error creating book: ", error)
        throw error;
    }
}
export default router;