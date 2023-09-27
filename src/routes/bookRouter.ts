import express from "express";
import { Request } from "express";
import conn from "../db_services/mysqlConnSetup";

const router = express.Router();
router.use(express.json());


// Get all books
router.get("/books", async (req, res) => {
    try {
        const result: any = await getAllBooks();
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong with fetching books");
    }
});

export async function getAllBooks() {
    const connection = await conn.getConnection();
    try{
        const [rows] = await connection.query(`SELECT * FROM books`);
        console.log("Books fetched successfully: ", rows);
        connection.release();
        return rows;
    }catch(err){
        console.log("no books found: ", err);
        connection.release();
    }
}

// Get book with author username
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
    const connection = await conn.getConnection();
    try{
        const [rows] = await connection.query(`CALL get_book_with_author(?)`, [id]);
        console.log("Book fetched successfully: ", rows);
        connection.release();
        return rows;
    }catch(err){
        console.log("no book found with the given ID: ", err);
        connection.release();
    }
}

// Create book
router.post("/book",  async (req, res) => {
    try{
        const result = await createBook(req.body);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal server error");
    }
});

export async function createBook(values: any) {
    const connection = await conn.getConnection();
    try {
        await connection.query(`INSERT INTO books (title, picture, summary, pages, amount, available_amount, author_id) VALUES (?,?,?,?,?,?,?)`, 
        [values.title, values.picture, values.summary, values.pages, values.amount, values.available_amount, values.author_id]);
        connection.release();
        console.log("book added");
        return "book added";
    }catch(err){
        console.log(err)
        connection.release();
    }
}
export default router;